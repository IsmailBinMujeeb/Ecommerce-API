import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import env from "../config/env.js";

export const sendEmail = async (to, subject, text) => {
    try {
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "GoShop",
                link: env.APP_URL || "http://localhost:3000",
            },
        });

        const emailText = mailGenerator.generatePlaintext(text);
        const emailHtml = mailGenerator.generate(text);

        const transporter = nodemailer.createTransport({
            host: env.MAILTRAP_SMTP_HOST,
            port: env.MAILTRAP_SMTP_PORT,
            secure: false,
            auth: {
                user: env.MAILTRAP_SMTP_USER,
                pass: env.MAILTRAP_SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"GoShop"`,
            to,
            subject,
            text: emailText,
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

export const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to GoShop! We're very excited to have you on our site.",
            action: {
                instructions: "Verify your email address to start using GoShop",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
