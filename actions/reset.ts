"use server"
import { ResetSchema } from "@/schema";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getUSerByEmail } from "@/data/user";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!"}
    }

    const { email } = validatedFields.data;

    const existingUser = await getUSerByEmail(email);

    if (!existingUser) {
        return { error: `User ${email} not found!` };
    }

    if (!existingUser.password) {
        return { error: "Unable to reset password!" }
    }

    const passwordResetToken = await generatePasswordResetToken(existingUser.email);
    const { error } =  await sendPasswordResetEmail(existingUser.email, passwordResetToken.token);

    if (error)
        return { error: "Something went wrong!" };
    
    return { success: `Reset link sent to your email!` };

}