import db from "@/lib/db";

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: { email: email }
        })
        return passwordResetToken;
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: { token: token }
        })
        return passwordResetToken;
    } catch {
        return null;
    }
}