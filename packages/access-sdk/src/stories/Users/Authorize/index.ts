import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import validateToken from "../../../functions/validateToken";
import { decodeJWT } from "../../../utils/tokenHelpers";

const prepare = (executionContext: any) => {
  const payload = pickKeysFromObject(executionContext, ["token"]);
  const decodedJwt = decodeJWT(payload.token);
  payload.tenant_id = decodedJwt.tenant_id || "default";
  return payload;
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = AccessSDK.getEngine();
  if (prepareResult.token === undefined) {
    throw {
      statusCode: 401,
      message: "unauthorized",
    };
  }
  const token = await validateToken(
    cie,
    prepareResult.token,
    prepareResult.tenant_id
  );

  if (token?.user.password_set) {
    return token;
  } else {
    throw {
      statusCode: 405,
      token: token,
      message: "setPassword",
    };
  }
};

const respond = ({ handleResult }: StoryExecutionContext) => {
  return handleResult;
};

export default {
  prepare,
  authorize,
  handle,
  respond,
};
