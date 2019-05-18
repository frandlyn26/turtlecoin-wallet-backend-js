"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const pbkdf2 = require("pbkdf2");
const Constants_1 = require("./Constants");
const WalletError_1 = require("./WalletError");
/**
 * Decrypt the wallet from the given encrypted string with the given password and return
 * a JSON string. Uses pbkdf2 encryption, not the same as turtle-service
 *
 * Returns the JSON, and an error. If error is not undefined, the JSON will
 * be an empty string.
 */
function decryptWalletFromString(dataString, password) {
    const data = Buffer.from(JSON.parse(dataString).data);
    return decryptWalletFromBuffer(data, password);
}
exports.decryptWalletFromString = decryptWalletFromString;
/**
 * Decrypt the wallet from the given Buffer with the given password and return
 * a JSON string. Uses pbkdf2 encryption, not the same as turtle-service
 *
 * Returns the JSON, and an error. If error is not undefined, the JSON will
 * be an empty string.
 */
function decryptWalletFromBuffer(data, password) {
    /* Take a slice containing the wallet identifier magic bytes */
    const magicBytes1 = data.slice(0, Constants_1.IS_A_WALLET_IDENTIFIER.length);
    if (magicBytes1.compare(Constants_1.IS_A_WALLET_IDENTIFIER) !== 0) {
        return ['', new WalletError_1.WalletError(WalletError_1.WalletErrorCode.NOT_A_WALLET_FILE)];
    }
    /* Remove the magic bytes */
    data = data.slice(Constants_1.IS_A_WALLET_IDENTIFIER.length, data.length);
    /* Grab the salt from the data */
    const salt = data.slice(0, 16);
    /* Remove the salt from the data */
    data = data.slice(salt.length, data.length);
    /* Derive our key with pbkdf2, 16 bytes long */
    const key = pbkdf2.pbkdf2Sync(password, salt, Constants_1.PBKDF2_ITERATIONS, 16, 'sha256');
    /* Setup the aes decryption */
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, salt);
    let decrypted;
    try {
        /* Perform the decryption */
        decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    }
    catch (err) {
        console.log('wrong password 1!!!');
        return ['', new WalletError_1.WalletError(WalletError_1.WalletErrorCode.WRONG_PASSWORD)];
    }
    /* Grab the second set of magic bytes */
    const magicBytes2 = decrypted.slice(0, Constants_1.IS_CORRECT_PASSWORD_IDENTIFIER.length);
    /* Verify the magic bytes are present */
    if (magicBytes2.compare(Constants_1.IS_CORRECT_PASSWORD_IDENTIFIER) !== 0) {
        console.log('wrong password 2!!!');
        return ['', new WalletError_1.WalletError(WalletError_1.WalletErrorCode.WRONG_PASSWORD)];
    }
    /* Remove the magic bytes */
    decrypted = decrypted.slice(Constants_1.IS_CORRECT_PASSWORD_IDENTIFIER.length, decrypted.length);
    console.log(`decrypted wallet => ${decrypted.toString()}`);
    return [decrypted.toString(), undefined];
}
exports.decryptWalletFromBuffer = decryptWalletFromBuffer;
