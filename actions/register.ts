"use server"

import { getUSerByEmail } from "@/data/user";
import db from "@/lib/db";
import { RegisterSchema } from "@/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


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
    const createdUser = await db.user.create({ data: { email: email, password: hashedPassword, name: name }});

    const verificationToken = await generateVerificationToken(createdUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Confimation email sent!" }
}