import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject, generateRandomKey } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "action",
    "name",
    "mode",
    "tenant_id",
    "account_id",
    "key_id",
    "status",
    "user_id",
  ]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = AccessSDK.getEngine();

  switch (prepareResult.action) {
    case "read":
      const readAccount: any = await cie.read("keys", {
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
      const secretKey = await generateRandomKey(16, cie.config.bcryptSalt);
      const publishableKey = await generateRandomKey(16, cie.config.bcryptSalt);

      const createdKey: any = await cie.create("keys", {
        payload: {
          name: prepareResult.name,
          account_id: prepareResult.account_id,
          mode: prepareResult.mode,
          secret_key: `sk_${prepareResult.mode}_${secretKey}`,
          publishable_key: `pk_${prepareResult.mode}_${publishableKey}`,
          status: "enabled",
        },
        transformations: ["pick_first"],
      });

      return createdKey;
      break;

    case "update":
      const existingAttribute: any = await cie.read("keys", {
        filterBy: [
          {
            attribute: "id",
            op: "eq",
            value: prepareResult.key_id,
          },
        ],
        transformations: ["pick_first"],
      });

      if (prepareResult.action === "update" && existingAttribute === null) {
        throw {
          message:
            "Cant find id passed in the url, please recheck the key id passed",
        };
      }
      let userDetails: any;
      if (existingAttribute) {
        userDetails = await cie.read("accounts", {
          filterBy: [
            {
              attribute: "id",
              op: "eq",
              value: existingAttribute.account_id,
            },
          ],
          transformations: ["pick_first"],
        });
      }
      if (prepareResult.user_id !== userDetails.creator_user_id) {
        throw {
          message: "User id does not match",
        };
      }
      if (existingAttribute.status === "enabled") {
        const updatedKeys: any = await cie.update("keys", {
          payload: {
            id: existingAttribute.id,
            status: prepareResult.status,
          },
          transformations: ["pick_first"],
        });

        return updatedKeys;
      } else {
        throw {
          message:
            "Keys are disabled for this account or check if status is passed as disabled",
        };
      }
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
