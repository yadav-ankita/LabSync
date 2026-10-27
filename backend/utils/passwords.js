const bcrypt = require("bcryptjs");

const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$/.test(value || "");

const comparePassword = async (plainPassword, storedPassword) => {
    if (isBcryptHash(storedPassword)) {
        return bcrypt.compare(plainPassword, storedPassword);
    }

    return plainPassword === storedPassword;
};

module.exports = { bcrypt, comparePassword, isBcryptHash };
