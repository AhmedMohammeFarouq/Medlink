import crypto from 'crypto';

export const generateHealthId = () => {
    const randomPart = crypto.randomBytes(6).toString('hex').toUpperCase();

    return `ML-${randomPart}`;
};