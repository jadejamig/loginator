"use server"

import { RegisterSchema } from "@/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { getUSerByEmail } from "@/data/user";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!"}
    }

    const { email, password, name} = validatedFields.data;

    const existingUser = await getUSerByEmail(email);

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({ data: { email: email, password: hashedPassword, name: name }})

    // TODO: Send verification token email

    return { success: "User created!" }
}