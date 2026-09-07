import { sendEmail } from "./services/email.service.js";
import env from "./config/env.js";

const testEmail = async () => {
    try {
        const result = await sendEmail({
            to: env.email.user,
            subject: "MedLink SMTP Test",
            text: "This is a test email from MedLink backend.",
            html: "<h1>MedLink SMTP Test</h1><p>This is a test email from MedLink backend.</p>",
        });

        console.log("Email sent successfully:", result.messageId);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

testEmail();