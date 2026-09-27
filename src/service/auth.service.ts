import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../persistance/model/index";
import { ApplicationError } from "../common/errors/application.error";
import { changePasswordSchema, loginSchema } from "../persistance/schema/index";

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  public async login(input: unknown): Promise<LoginResponse> {
    const validatedData = loginSchema.parse(input);

    const user = await UserModel.findOne({
      email: validatedData.email,
    });

    if (!user) {
      throw new ApplicationError(
        "Invalid email or password",
        401,
        "UNAUTHORIZED",
      );
    }

    const passwordMatches = await bcrypt.compare(
      validatedData.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new ApplicationError(
        "Invalid email or password",
        401,
        "UNAUTHORIZED",
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new ApplicationError(
        "JWT secret is not configured",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    const accessToken = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN ||
          "1d") as jwt.SignOptions["expiresIn"],
      },
    );

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }
  public async changePassword(userId: string, input: unknown): Promise<void> {
    const validatedData = changePasswordSchema.parse(input);

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new ApplicationError("User not found", 404, "NOT_FOUND");
    }

    const passwordMatches = await bcrypt.compare(
      validatedData.currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      throw new ApplicationError(
        "Current password is incorrect",
        401,
        "UNAUTHORIZED",
      );
    }

    if (validatedData.currentPassword === validatedData.newPassword) {
      throw new ApplicationError(
        "New password must be different from current password",
        400,
        "BAD_REQUEST",
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);

    user.password = hashedPassword;

    await user.save();
  }
}

export const authService = new AuthService();
