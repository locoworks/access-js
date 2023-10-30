import * as jose from "jose";
import AccessSDK from "../sdk";

const decodeJWT = (jwt: string) => {
  try {
    const claims = jose.decodeJwt(jwt);
    return claims;
  } catch (error) {
    throw error;
  }
};

const validateJWT = async (jwt: string) => {
  const accessConfig = AccessSDK.getConfig();
  try {
    if (accessConfig.publicKey !== undefined) {
      const publicKeyEnv = accessConfig.publicKey.replace(/\\n/g, "\n");
      const ecPublicKey = await jose.importSPKI(
        publicKeyEnv,
        accessConfig.importAlg || "ed25519"
      );
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
  payload = {}
) => {
  const accessConfig = AccessSDK.getConfig();

  if (accessConfig.privateKey !== undefined) {
    const privateKeyEnv = accessConfig.privateKey.replace(/\\n/g, "\n");
    const ecPrivateKey = await jose.importPKCS8(
      privateKeyEnv,
      accessConfig.importAlg || "ed25519"
    );

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: accessConfig.encDecAlg || "EdDSA" })
      .setExpirationTime(accessConfig.jwtExpiry || "1y")
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

export { decodeJWT, generateJWT, validateJWT };
