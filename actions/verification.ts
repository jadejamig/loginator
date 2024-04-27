"use server";

import { getUSerByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import db from "@/lib/db";

export const verification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken)
        return { error: "Token is invalid or already expired!" }

    const existingUser = await getUSerByEmail(existingToken.email);
    if (!existingUser)
        return { error: "Email does not exist!" };

    if (existingUser.emailVerified)
        return { success: "Email is already verified!" }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired)
        return { error: "Token is invalid or already expired!" }


    await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email }
    })

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Email verified!"}
}