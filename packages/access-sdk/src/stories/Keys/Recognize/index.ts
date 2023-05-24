import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject, generateRandomKey } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, ["key"]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = AccessSDK.getEngine();
  let keyType: string;
  let existingKey: any;

  try {
    if (prepareResult.key.startsWith("pk_live")) {
      keyType = "publishable_key";

      existingKey = await cie.read("keys", {
        filterBy: [
          {
            attribute: "publishable_key",
            op: "eq",
            value: prepareResult.key,
          },
        ],
        transformations: ["pick_first"],
      });
    }

    if (prepareResult.key.startsWith("sk_live")) {
      keyType = "secret_key";

      existingKey = await cie.read("keys", {
        filterBy: [
          {
            attribute: "secret_key",
            op: "eq",
            value: prepareResult.key,
          },
        ],
        transformations: ["pick_first"],
      });
    }

    if (existingKey === null) {
      throw {
        message: "InvalidKey",
      };
    }

    return existingKey;
  } catch (error) {
    throw {
      message: "InvalidKey",
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
