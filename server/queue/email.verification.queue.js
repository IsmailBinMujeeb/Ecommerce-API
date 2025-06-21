import { Queue } from "bullmq";
import redis from "../config/redis.config.js";

export default new Queue("email-verification-queue", { connection: redis })