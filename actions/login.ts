"use server"

import { signIn } from "@/auth";
import { LoginSchema } from "@/schema";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getUSerByEmail } from "@/data/user";
import { generateTwoFactorConfirmation, generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail, getTwoFactorTokenByToken } from "@/data/two-factor-token";
import db from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!"};
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUSerByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid username or password!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        if (!verificationToken)
            return { error: "An unexpected problem occurred!" };

        const { error } = await sendVerificationEmail(verificationToken.email, verificationToken.token)

        if (error)
            return { error: "An unexpected problem occurred!" };

        return { success: "Verification email sent!" };
    }

    if (existingUser.isTwoFactorEnabled) {
        const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!existingTwoFactorConfirmation) {
            const existingTwoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            
            if (!existingTwoFactorToken) {
                const twoFactorToken = await generateTwoFactorToken(existingUser.email);
                const { error } = await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
        
                if (error)
                    return { error: "An unexpected problem occurred!" };

                return { twoFactor: true };
            }

            const hasExpired = new Date(existingTwoFactorToken.expires) < new Date();

            if (hasExpired || existingTwoFactorToken.token !== code)
                return { error: "Token is invalid or already expired!" };

            const twoFactorConfirmation = await generateTwoFactorConfirmation(existingUser);

            if (!twoFactorConfirmation)
                return { error: "Something went wrong!" };

            await db.twoFactorToken.delete({
                where: { id: existingTwoFactorToken.id}
            });
        }
    }
    
    try {
        await signIn("credentials", {
            email: email,
            password: password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid username or password!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
}