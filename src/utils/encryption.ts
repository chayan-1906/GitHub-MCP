import crypto from 'crypto';
import {TOKEN_SECRET} from "../config/config";

const algorithm = 'aes-256-gcm';
const secret = Buffer.from(TOKEN_SECRET!, 'hex'); // 32-byte (256-bit) secret key
// console.log('length', secret.length);

export function encryptToken(plain: string): { iv: string; content: string; tag: string; } {
    const iv = crypto.randomBytes(12); // AES-GCM standard IV size
    const cipher = crypto.createCipheriv(algorithm, secret, iv);
    const encrypted = Buffer.concat([
        cipher.update(plain, 'utf8'),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
        tag: tag.toString('hex'),
    };
}

export function decryptToken(data: { iv: string; content: string; tag: string; }): string {
    const decipher = crypto.createDecipheriv(
        algorithm,
        secret,
        Buffer.from(data.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(data.tag, 'hex'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(data.content, 'hex')),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
}
