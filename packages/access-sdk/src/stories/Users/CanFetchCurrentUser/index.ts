import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import type { StoryExecutionContext } from "@locoworks/cijson-utils";
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
  try {
    const cie = AccessSDK.getEngine();

    let validatedToken: any = await validateToken(
      cie,
      prepareResult.token,
      prepareResult.tenant_id
    );

    const user: any = await cie.read("users", {
      filterBy: [
        {
          attribute: "id",
          op: "eq",
          value: validatedToken.user.id,
        },
        {
          attribute: "tenant_id",
          op: "eq",
          value: prepareResult.tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    return user;
  } catch (error) {
    console.log("Error in reset password", error);
    throw error;
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
