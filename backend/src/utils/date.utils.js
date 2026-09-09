export const getExpirationDate = (expiresIn) => {
    const value = parseInt(expiresIn);

    if (Number.isNaN(value)) {
        throw new Error("Invalid expiration value");
    }

    if (expiresIn.endsWith("s")) {
        return new Date(Date.now() + value * 1000);
    }

    if (expiresIn.endsWith("m")) {
        return new Date(Date.now() + value * 60 * 1000);
    }

    if (expiresIn.endsWith("h")) {
        return new Date(Date.now() + value * 60 * 60 * 1000);
    }

    if (expiresIn.endsWith("d")) {
        return new Date(Date.now() + value * 24 * 60 * 60 * 1000);
    }

    throw new Error("Unsupported expiration unit");
};