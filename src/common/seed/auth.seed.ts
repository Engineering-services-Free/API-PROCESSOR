import "dotenv/config";

import bcrypt from "bcryptjs";

import { connectDatabase } from "../../db/connect.js";
import { UserModel } from "../../persistance/model/index.js";

const seedAdmin = async (): Promise<void> => {
  try {
    await connectDatabase();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env");
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      console.log(`Admin user already exists: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await UserModel.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin user created successfully: ${email}`);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
};

seedAdmin();
