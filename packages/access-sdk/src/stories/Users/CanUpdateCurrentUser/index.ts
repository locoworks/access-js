import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import validateToken from "../../../functions/validateToken";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, ["tenant_id", "meta", "token"]);
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

    let user = await cie.patch("users", {
      payload: {
        id: validatedToken.user.id,
        meta: prepareResult.meta,
      },
      transformations: ["pick_first"],
    });

    return user;
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
