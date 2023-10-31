import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import validateToken from "../../../functions/validateToken";
import { decodeJWT } from "../../../utils/tokenHelpers";

const prepare = (executionContext: any) => {
  const payload = pickKeysFromObject(executionContext, ["id"]);
  // const decodedJwt = decodeJWT(payload.token);
  // payload.tenant_id = decodedJwt.tenant_id || "default";
  return payload;
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    const cie = AccessSDK.getEngine();

    let user = await cie.delete("users", {
      payload: {
        id: prepareResult.id,
      },
      transformations: ["pick_first"],
    });

    await cie.delete("attributes", {
      filterBy: [
        {
          attribute: "user_id",
          op: "eq",
          value: prepareResult.id,
        },
      ],
      transformations: ["pick_first"],
    });

    await cie.delete("tokens", {
      filterBy: [
        {
          attribute: "sub",
          op: "eq",
          value: prepareResult.id,
        },
        {
          attribute: "issuer",
          op: "eq",
          value: "user",
        },
      ],
      transformations: ["pick_first"],
    });

    return {
      message: "Successfully Deleted",
    };
  } catch (error) {
    console.log("Error in update user", error);
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
