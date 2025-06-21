import { Worker } from "bullmq";
import env from "../config/env.js";
import redis from "../config/redis.config.js";
import { sendEmail } from "../utils/Mail.utils.js";
import { emailVerificationMailgenContent } from "../utils/Mail.utils.js";

const emailVerificationWorker = new Worker("email-verification-queue", async (job) => {

    const { email, username, unhashedToken } = job.data;

    if (!email || !username || !unhashedToken) {
        throw new Error("Invalid job data: missing required fields");
    }

    console.log(email, username)
    await sendEmail(
        email,
        "Welcome to GoShop",
        emailVerificationMailgenContent(
            username,
            `${env.CLIENT_BASE_URL}/api/user/verify-email/${unhashedToken}`,
        ));
}, { connection: redis, attemps: 3 });

emailVerificationWorker.on("completed", (job) => {
    if (env.NODE_ENV !== "production") console.log(`Job ${job.id} has been completed successfully`);
});

emailVerificationWorker.on("failed", (job, error) => {
    if (job && env.NODE_ENV !== "production") {
        console.error(`Job ${job.id} failed with error:`, error.stack || error);
    }
    console.log("JI")
});