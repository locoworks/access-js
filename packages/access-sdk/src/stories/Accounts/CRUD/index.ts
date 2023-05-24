import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject, generateRandomKey } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "action",
    "name",
    "tenant_id",
    "user_id",
    "account_id",
  ]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = AccessSDK.getEngine();
  console.log("prepareResult", prepareResult);

  switch (prepareResult.action) {
    case "read":
      const readAccount: any = await cie.read("accounts", {
        includeRelations: ["keys"],
        filterBy: [
          {
            attribute: "id",
            op: "eq",
            value: prepareResult.account_id,
          },
        ],
        transformations: ["pick_first"],
      });
      return readAccount;
      break;

    case "create":
      const createdAccount: any = await cie.create("accounts", {
        payload: {
          name: prepareResult.name,
          tenant_id: prepareResult.tenant_id,
          creator_user_id: prepareResult.user_id,
        },
        transformations: ["pick_first"],
      });

      return createdAccount;
      break;
  }

  return { status: "ok" };
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
