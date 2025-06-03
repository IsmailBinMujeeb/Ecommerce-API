import crypto from 'crypto';

export const generateTemporaryTokens = () => {

    const unhashedToken = crypto.randomBytes(16).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');
    const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    return {
        unhashedToken,
        hashedToken,
        tokenExpiry
    };
}