import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid'
import db from './db';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import crypto from 'crypto';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { User } from '@prisma/client';

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + (3600 * 1000)); // Expires in 1 hour

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email: email,
            token: token,
            expires: expires
        }
    })
    
    return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + (3600 * 1000)); // Expires in 1 hour

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email: email,
            token: token,
            expires: expires
        }
    })
    
    return passwordResetToken
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + (3600 * 1000)); // Expires in 1 hour

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {id: existingToken.id}
        });
    }

    const twoFactorToken = db.twoFactorToken.create({
        data: {email: email, token: token, expires: expires}
    })

    return twoFactorToken;
}

export const generateTwoFactorConfirmation = async (user: User) => {
    const twoFactorConfirmation = await db.twoFactorConfirmation.create({
        data: {
            userId: user.id
        }
    });

    return twoFactorConfirmation;
}