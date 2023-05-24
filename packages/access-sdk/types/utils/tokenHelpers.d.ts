import * as jose from "jose";
declare const decodeJWT: (jwt: string) => Promise<jose.JWTPayload>;
declare const generateJWT: (jti: string, sub: string, issuer: string, payload?: {}, expiry?: string) => Promise<string>;
export { generateJWT, decodeJWT };
