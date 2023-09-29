import AccessSDK from "../sdk";
import { generateJWT } from "./tokenHelpers";

const createTokenForUser = async (user: any) => {
  try {
    const cie = AccessSDK.getEngine();
    let token: any = await cie.create("tokens", {
      payload: {
        sub: user.id,
        issuer: "user",
        other_info: JSON.stringify({}),
        tenant_id: user.tenant_id,
      },
      transformations: ["pick_first"],
    });

    let jwt = await generateJWT(token.id, token.sub, token.issuer);
    token["access_token"] = jwt;
    return { access_token: jwt };
  } catch (error) {
    throw error;
  }
};

const createTokenForAdmin = async (admin: any) => {
  try {
    const cie = AccessSDK.getEngine();
    let token: any = await cie.create("tokens", {
      payload: {
        sub: admin.id,
        issuer: "admin",
        other_info: {},
        tenant_id: admin.tenant_id,
      },
      transformations: ["pick_first"],
    });

    let jwt = await generateJWT(token.id, token.sub, token.issuer);
    token["access_token"] = jwt;
    return { access_token: jwt };
  } catch (error) {
    throw error;
  }
};

export { createTokenForUser, createTokenForAdmin };
