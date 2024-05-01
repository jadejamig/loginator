import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    const sendVerificationEmailResponse = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });

    return sendVerificationEmailResponse;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;

    const sendPasswordResetEmailResponse = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`
    });

    return sendPasswordResetEmailResponse;
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
    const sendTwoFactorEmailResponse = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Two Factor Authentication Code",
        html: `<p>Your 2FA Code: ${token}</p>`
    });

    return sendTwoFactorEmailResponse;
}