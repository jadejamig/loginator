"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUSerByEmail } from "@/data/user";
import db from "@/lib/db";
import { NewPasswordSchema } from "@/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success)
        return { error: "Invalid fields!"}

    const { password, confirmPassword } = validatedFields.data;
    if (password !== confirmPassword)
        return { error: "The passwords do not match!"}

    if (!token)
        return { error: "Token is missing!"}

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken)
        return { error: "The link is invalid or already expired!" }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired)
        return { error: "The link is invalid or already expired!" }

    const existingUser = await getUSerByEmail(existingToken.email);
    if (!existingUser)
        return { error: "Email does not exist!" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await db.user.update({
        where: { id: existingUser.id},
        data: { password: hashedPassword}
    });

    if (!updatedUser)
        return { error: "A problem occurred while updating password!"};
    
    const deletedToken = await db.passwordResetToken.delete({
        where: { id: existingToken.id}
    });

    if (!deletedToken)
        return { error: "An unexpected problem occurred!" };

    return { success: "Successfully updated password."};
}