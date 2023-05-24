import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import validateToken from "../../../functions/validateToken";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, ["token", "tenant_id"]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = AccessSDK.getEngine();
  return await validateToken(cie, prepareResult.token, prepareResult.tenant_id);
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
