import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import validateToken from "../../../functions/validateToken";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, ["tenant_id", "token"]);
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
