import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: {
        user: env.email.user,
        pass: env.email.password,
    },
});

export const sendEmail = async ({
    to,
    subject,
    text,
    html,
}) => {
    return transporter.sendMail({
        from: env.email.from,
        to,
        subject,
        text,
        html,
    });
};
export const sendVerificationEmail = async ({
    to,
    firstName,
    verificationCode,
}) => {
    return sendEmail({
        to,
        subject: "Verify your MedLink account",
        text: `Hi ${firstName},

Welcome to MedLink!

Your email verification code is: ${verificationCode}

This code will expire in 10 minutes.

If you did not create this account, please ignore this email.

MedLink Team`,
        html: `
            <div style="
                margin: 0;
                padding: 40px 20px;
                background-color: #f4f7fb;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            ">

                <div style="
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                ">

                    <!-- Header -->
                    <div style="
                        padding: 28px 30px;
                        background-color: #0f766e;
                        text-align: center;
                    ">
                        <div style="
                            font-size: 28px;
                            font-weight: 700;
                            color: #ffffff;
                            letter-spacing: 1px;
                        ">
                            MedLink
                        </div>

                        <div style="
                            margin-top: 6px;
                            font-size: 14px;
                            color: #d1fae5;
                        ">
                            Your Healthcare Partner
                        </div>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 35px;">

                        <h2 style="
                            margin: 0 0 16px;
                            font-size: 24px;
                            color: #111827;
                        ">
                            Verify your email
                        </h2>

                        <p style="
                            margin: 0 0 10px;
                            font-size: 16px;
                            line-height: 1.7;
                        ">
                            Hi <strong>${firstName}</strong>,
                        </p>

                        <p style="
                            margin: 0 0 28px;
                            font-size: 15px;
                            line-height: 1.7;
                            color: #6b7280;
                        ">
                            Welcome to MedLink! Please use the verification
                            code below to verify your email address and
                            activate your account.
                        </p>

                        <!-- Verification Code Card -->
                        <div style="
                            margin: 0 auto 25px;
                            padding: 24px;
                            background-color: #f0fdfa;
                            border: 1px solid #99f6e4;
                            border-radius: 12px;
                            text-align: center;
                        ">

                            <div style="
                                margin-bottom: 12px;
                                font-size: 13px;
                                font-weight: 600;
                                color: #0f766e;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            ">
                                Verification Code
                            </div>

                            <div style="
                                display: inline-block;
                                padding: 14px 22px;
                                background-color: #ffffff;
                                border: 1px solid #d1d5db;
                                border-radius: 10px;
                                font-size: 30px;
                                font-weight: 700;
                                letter-spacing: 8px;
                                color: #111827;
                                font-family: Arial, Helvetica, sans-serif;
                            ">
                                ${verificationCode}
                            </div>

                            <p style="
                                margin: 16px 0 0;
                                font-size: 13px;
                                color: #6b7280;
                            ">
                                Enter this code in the MedLink application.
                            </p>
                        </div>

                        <!-- Expiration -->
                        <div style="
                            margin: 0 0 25px;
                            padding: 14px 16px;
                            background-color: #fffbeb;
                            border-left: 4px solid #f59e0b;
                            border-radius: 6px;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 13px;
                                line-height: 1.6;
                                color: #92400e;
                            ">
                                <strong>Important:</strong>
                                This verification code expires in
                                <strong>10 minutes</strong>.
                            </p>
                        </div>

                        <p style="
                            margin: 0;
                            font-size: 13px;
                            line-height: 1.6;
                            color: #9ca3af;
                        ">
                            If you did not create a MedLink account,
                            you can safely ignore this email.
                        </p>

                    </div>

                    <!-- Footer -->
                    <div style="
                        padding: 22px 30px;
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                    ">

                        <p style="
                            margin: 0 0 6px;
                            font-size: 13px;
                            color: #6b7280;
                        ">
                            MedLink Team
                        </p>

                        <p style="
                            margin: 0;
                            font-size: 12px;
                            color: #9ca3af;
                        ">
                            This is an automated message. Please do not reply.
                        </p>

                    </div>

                </div>

            </div>
        `,
    });
};
export const sendWelcomeEmail = async ({
    to,
    firstName,
}) => {
    return sendEmail({
        to,
        subject: "Welcome to MedLink 🎉",
        text: `Hi ${firstName},

Welcome to MedLink!

Your email has been successfully verified and your account is now active.

You can now start using MedLink and access our healthcare services.

We're happy to have you with us!

MedLink Team`,
        html: `
            <div style="
                margin: 0;
                padding: 40px 20px;
                background-color: #f4f7fb;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            ">

                <div style="
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                ">

                    <!-- Header -->
                    <div style="
                        padding: 32px 30px;
                        background-color: #0f766e;
                        text-align: center;
                    ">
                        <div style="
                            font-size: 30px;
                            font-weight: 700;
                            color: #ffffff;
                            letter-spacing: 1px;
                        ">
                            MedLink
                        </div>

                        <div style="
                            margin-top: 8px;
                            font-size: 14px;
                            color: #d1fae5;
                        ">
                            Your Healthcare Partner
                        </div>
                    </div>

                    <!-- Content -->
                    <div style="padding: 42px 35px;">

                        <div style="
                            text-align: center;
                            font-size: 42px;
                            margin-bottom: 18px;
                        ">
                            🎉
                        </div>

                        <h2 style="
                            margin: 0 0 18px;
                            text-align: center;
                            font-size: 26px;
                            color: #111827;
                        ">
                            Welcome to MedLink!
                        </h2>

                        <p style="
                            margin: 0 0 14px;
                            font-size: 16px;
                            line-height: 1.7;
                        ">
                            Hi <strong>${firstName}</strong>,
                        </p>

                        <p style="
                            margin: 0 0 24px;
                            font-size: 15px;
                            line-height: 1.8;
                            color: #6b7280;
                        ">
                            Your email has been successfully verified and
                            your MedLink account is now active.
                        </p>

                        <!-- Success Card -->
                        <div style="
                            margin-bottom: 28px;
                            padding: 20px;
                            background-color: #f0fdf4;
                            border: 1px solid #bbf7d0;
                            border-radius: 12px;
                            text-align: center;
                        ">
                            <div style="
                                font-size: 15px;
                                font-weight: 600;
                                color: #166534;
                                margin-bottom: 6px;
                            ">
                                Your account is ready
                            </div>

                            <div style="
                                font-size: 13px;
                                color: #4b5563;
                            ">
                                You can now start using MedLink.
                            </div>
                        </div>

                        <p style="
                            margin: 0 0 28px;
                            text-align: center;
                            font-size: 15px;
                            line-height: 1.7;
                            color: #6b7280;
                        ">
                            We're happy to have you with us!
                        </p>

                        <!-- CTA -->
                        <div style="
                            text-align: center;
                            margin-bottom: 10px;
                        ">
                            <a
                                href="${env.clientUrl}"
                                style="
                                    display: inline-block;
                                    padding: 13px 28px;
                                    background-color: #0f766e;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-size: 14px;
                                    font-weight: 600;
                                "
                            >
                                Open MedLink
                            </a>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="
                        padding: 22px 30px;
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                    ">
                        <p style="
                            margin: 0 0 6px;
                            font-size: 13px;
                            color: #6b7280;
                        ">
                            MedLink Team
                        </p>

                        <p style="
                            margin: 0;
                            font-size: 12px;
                            color: #9ca3af;
                        ">
                            This is an automated message. Please do not reply.
                        </p>
                    </div>

                </div>

            </div>
        `,
    });
};