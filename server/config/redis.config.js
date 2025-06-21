import { Redis } from "ioredis";
import env from "./env.js";

const redis = new Redis(env.REDIS_URI, "localhost", { maxRetriesPerRequest: null });

export default redis;
