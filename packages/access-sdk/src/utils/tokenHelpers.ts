import * as jose from "jose";
const jwtExpiry = process.env.JWT_EXPIRY_TIME || "1y";

const decodeJWT = async (jwt: string) => {
  try {
    if (process.env.ACCESS_PUBLIC_KEY !== undefined) {
      const publicKeyEnv = process.env.ACCESS_PUBLIC_KEY.replace(/\\n/g, "\n");
      const ecPublicKey = await jose.importSPKI(publicKeyEnv, "ed25519");
      const { payload } = await jose.jwtVerify(jwt, ecPublicKey);
      return payload;
    } else {
      throw {
        message: "Missing ACCESS_PUBLIC_KEY",
      };
    }
  } catch (error) {
    throw error;
  }
};

const generateJWT = async (
  jti: string,
  sub: string,
  issuer: string,
  payload = {},
  expiry = jwtExpiry
) => {
  if (process.env.ACCESS_PRIVATE_KEY !== undefined) {
    const privateKeyEnv = process.env.ACCESS_PRIVATE_KEY.replace(/\\n/g, "\n");
    const ecPrivateKey = await jose.importPKCS8(privateKeyEnv, "ed25519");

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "EdDSA" })
      .setExpirationTime(expiry)
      .setSubject(sub)
      .setAudience("access")
      .setIssuer(issuer)
      .setJti(jti)
      .sign(ecPrivateKey);

    return jwt;
  } else {
    throw {
      message: "Missing ACCESS_PRIVATE_KEY",
    };
  }
};

export { generateJWT, decodeJWT };
