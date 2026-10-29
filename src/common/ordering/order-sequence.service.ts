import { createHash } from "node:crypto";
import mongoose, { type Model, type ClientSession } from "mongoose";
import { ApplicationError } from "../errors/application.error.js";

type OrderedItem = {
  _id: unknown;
  order: number;
  createdAt?: Date;
  publishedAt?: Date;
  year?: number;
};

type OrderModel = Model<any>;
type OrderFilter = Record<string, unknown>;

const getCurrentOrder = (item: OrderedItem) =>
  Number.isFinite(item.order) ? item.order : 0;

const compareBySort = (
  left: OrderedItem,
  right: OrderedItem,
  tieBreakSort: Record<string, 1 | -1>,
) => {
  for (const [field, direction] of Object.entries(tieBreakSort)) {
    const leftValue = left[field as keyof OrderedItem];
    const rightValue = right[field as keyof OrderedItem];

    if (leftValue instanceof Date && rightValue instanceof Date) {
      const difference = leftValue.getTime() - rightValue.getTime();
      if (difference !== 0) return difference * direction;
      continue;
    }

    if (leftValue !== rightValue) {
      if (leftValue == null) return 1;
      if (rightValue == null) return -1;

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return (leftValue - rightValue) * direction;
      }

      return String(leftValue).localeCompare(String(rightValue)) * direction;
    }
  }

  return String(left._id).localeCompare(String(right._id));
};

const makeScopeFilter = (
  scopeField: string | undefined,
  scopeValue: unknown,
): OrderFilter => (scopeField ? { [scopeField]: scopeValue ?? null } : {});

const makeLockKey = (entity: string) => `${entity}:sequence`;

async function withSequenceTransaction<T>(
  lockKeys: string[],
  callback: (session: ClientSession) => Promise<T>,
): Promise<T> {
  const keys = [...new Set(lockKeys)].sort();

  for (let attempt = 0; ; attempt += 1) {
    const session = await mongoose.startSession();

    try {
      let result!: T;
      await session.withTransaction(async () => {
        for (const key of keys) {
          const lockId = new mongoose.Types.ObjectId(
            createHash("sha256").update(key).digest("hex").slice(0, 24),
          );
          await mongoose.connection.collection("ordering_locks").updateOne(
            { _id: lockId },
            { $inc: { version: 1 } },
            { upsert: true, session },
          );
        }

        result = await callback(session);
      });

      return result;
    } catch (error) {
      const isLockCreationRace =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000 &&
        "keyPattern" in error &&
        typeof error.keyPattern === "object" &&
        error.keyPattern !== null &&
        "_id" in error.keyPattern;

      if (!isLockCreationRace || attempt >= 4) {
        throw error;
      }
    } finally {
      await session.endSession();
    }
  }
}

async function findSequence(
  model: OrderModel,
  scope: OrderFilter,
  session: ClientSession,
  tieBreakSort: Record<string, 1 | -1>,
): Promise<OrderedItem[]> {
  return model
    .find(scope as never)
    .sort({ order: 1, ...tieBreakSort, _id: 1 })
    .session(session)
    .lean<OrderedItem[]>()
    .exec();
}

async function shiftToTemporaryOrders(
  model: OrderModel,
  scope: OrderFilter,
  items: OrderedItem[],
  session: ClientSession,
): Promise<number> {
  if (items.length === 0) return 1;

  const currentOrders = items.map(getCurrentOrder);
  const minOrder = Math.min(...currentOrders);
  const maxOrder = Math.max(...currentOrders);
  const offset = Math.max(1, maxOrder - minOrder + 1);

  const result = await model.updateMany(
    scope as never,
    { $inc: { order: offset } },
    { session, timestamps: false },
  ).exec();

  if (result.matchedCount !== items.length) {
    throw new ApplicationError(
      "The order sequence changed during the update",
      409,
      "ORDER_CONFLICT",
    );
  }

  return offset;
}

async function setSequence(
  model: OrderModel,
  items: OrderedItem[],
  session: ClientSession,
): Promise<void> {
  let order = 1;

  for (const item of items) {
    const result = await model
      .updateOne(
        { _id: item._id },
        { $set: { order } },
        { session, timestamps: item.order !== order },
      )
      .exec();

    if (result.matchedCount !== 1) {
      throw new ApplicationError(
        "Failed to persist the order sequence",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    order += 1;
  }
}

export function insertAt<T>(
  items: T[],
  item: T,
  requestedOrder: number,
): T[] {
  const index =
    requestedOrder <= 0
      ? items.length
      : Math.min(Math.max(Math.trunc(requestedOrder) - 1, 0), items.length);

  return [...items.slice(0, index), item, ...items.slice(index)];
}

export function normalizeNumberedSequence<T>(
  items: readonly T[],
  getPosition: (item: T) => number,
  setPosition: (item: T, position: number) => T,
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (left, right) =>
        getPosition(left.item) - getPosition(right.item) ||
        left.index - right.index,
    )
    .map(({ item }, index) => setPosition(item, index + 1));
}

export async function createOrderedRecord(
  entity: string,
  model: OrderModel,
  data: object,
  scopeField?: string,
  scopeValue?: unknown,
  tieBreakSort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<any> {
  const scope = makeScopeFilter(scopeField, scopeValue);
  const lockKey = makeLockKey(entity);
  const recordData = data as Record<string, unknown>;

  return withSequenceTransaction([lockKey], async (session) => {
    const existing = await findSequence(model, scope, session, tieBreakSort);
    await shiftToTemporaryOrders(model, scope, existing, session);

    const requestedOrder = Number(recordData.order ?? 0);
    const insertion = Math.min(
      Math.max(Math.trunc(requestedOrder) || existing.length + 1, 1),
      existing.length + 1,
    );
    const [created] = await model.create([{ ...recordData, order: 0 }], {
      session,
    });

    const completeSequence = insertAt(existing, created.toObject(), insertion);
    await setSequence(model, completeSequence, session);

    const persisted = await model
      .findById(created._id)
      .session(session)
      .lean()
      .exec();

    if (!persisted) {
      throw new ApplicationError(
        "Failed to persist the ordered record",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    return persisted;
  });
}

export async function updateOrderedRecord(
  entity: string,
  model: OrderModel,
  id: string,
  data: object,
  scopeField?: string,
  tieBreakSort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<any | null> {
  const lockKey = makeLockKey(entity);
  const updateData = data as Record<string, unknown>;

  return withSequenceTransaction([lockKey], async (session) => {
    const existing = (await model
      .findById(id)
      .session(session)
      .lean()
      .exec()) as (OrderedItem & Record<string, unknown>) | null;

    if (!existing) return null;

    const oldScopeValue = scopeField ? existing[scopeField] : undefined;
    const nextScopeValue =
      scopeField && Object.prototype.hasOwnProperty.call(updateData, scopeField)
        ? updateData[scopeField]
        : oldScopeValue;
    const oldScope = makeScopeFilter(scopeField, oldScopeValue);
    const nextScope = makeScopeFilter(scopeField, nextScopeValue);
        const scopeChanged =
          String(oldScopeValue ?? "") !== String(nextScopeValue ?? "");
    const orderChanged =
      Object.prototype.hasOwnProperty.call(updateData, "order") &&
      Number(updateData.order) !== existing.order;

    if (!scopeChanged && !orderChanged) {
      return model
        .findByIdAndUpdate(id, updateData, {
          returnDocument: "after",
          runValidators: true,
          session,
        })
        .lean()
        .exec();
    }

    const oldItems = await findSequence(model, oldScope, session, tieBreakSort);
    const nextItems = scopeChanged
      ? await findSequence(model, nextScope, session, tieBreakSort)
      : oldItems;
    const sourceWithoutItem = oldItems.filter(
      (item) => String(item._id) !== String(existing._id),
    );
    const destinationBase = scopeChanged ? nextItems : sourceWithoutItem;
    const requestedOrder = Number(updateData.order ?? existing.order);
    const destinationOrder =
      Math.min(
        Math.max(Math.trunc(requestedOrder) || 1, 1),
        destinationBase.length + 1,
      );
    const moved = insertAt(destinationBase, existing, destinationOrder);

    const oldOffset = await shiftToTemporaryOrders(
      model,
      oldScope,
      oldItems,
      session,
    );
    const destinationOffset = scopeChanged
      ? await shiftToTemporaryOrders(
          model,
          nextScope,
          nextItems,
          session,
        )
      : oldOffset;
    const temporaryOrder =
      Math.max(
        ...oldItems.map((item) => getCurrentOrder(item) + oldOffset),
        ...nextItems.map((item) => getCurrentOrder(item) + destinationOffset),
        0,
      ) + 1;

    const updated = await model
      .findByIdAndUpdate(
        id,
        { ...updateData, order: temporaryOrder },
        { returnDocument: "after", runValidators: true, session },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new ApplicationError(
        "Failed to update the ordered record",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    if (scopeChanged) {
      await setSequence(model, sourceWithoutItem, session);
    }
    await setSequence(model, moved, session);

    const persisted = await model
      .findById(updated._id)
      .session(session)
      .lean()
      .exec();

    if (!persisted) {
      throw new ApplicationError(
        "Failed to persist the updated order",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    return persisted;
  });
}

export async function deleteOrderedRecord(
  entity: string,
  model: OrderModel,
  id: string,
  scopeField?: string,
  tieBreakSort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<any | null> {
  const lockKey = makeLockKey(entity);

  return withSequenceTransaction([lockKey], async (session) => {
    const existing = (await model
      .findById(id)
      .session(session)
      .lean()
      .exec()) as (OrderedItem & Record<string, unknown>) | null;

    if (!existing) return null;

    const scope = makeScopeFilter(
      scopeField,
      scopeField ? existing[scopeField] : undefined,
    );
    const sequence = await findSequence(model, scope, session, tieBreakSort);
    const remaining = sequence.filter(
      (item) => String(item._id) !== String(existing._id),
    );

    const deletion = await model
      .deleteOne({ _id: existing._id }, { session })
      .exec();

    if (deletion.deletedCount !== 1) {
      throw new ApplicationError(
        "Failed to delete the ordered record",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }
    await shiftToTemporaryOrders(model, scope, remaining, session);
    await setSequence(model, remaining, session);

    return existing;
  });
}

export async function moveOrderedRecord(
  entity: string,
  model: OrderModel,
  id: string,
  order: number,
  scopeField?: string,
  tieBreakSort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<any | null> {
  return updateOrderedRecord(
    entity,
    model,
    id,
    { order },
    scopeField,
    tieBreakSort,
  );
}

export function validateOrderMove(input: unknown): {
  id: string;
  order: number;
} {
  if (
    typeof input !== "object" ||
    input === null ||
    !("id" in input) ||
    typeof input.id !== "string" ||
    !/^[0-9a-fA-F]{24}$/.test(input.id) ||
    !("order" in input) ||
    typeof input.order !== "number" ||
    !Number.isInteger(input.order) ||
    input.order < 1
  ) {
    throw new ApplicationError(
      "A valid record ID and positive order are required",
      400,
      "VALIDATION_ERROR",
    );
  }

  return { id: input.id, order: input.order };
}
