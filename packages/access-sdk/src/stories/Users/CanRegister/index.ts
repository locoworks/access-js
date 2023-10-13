import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";

const prepare = (executionContext: any) => {
  let prepareResult = pickKeysFromObject(executionContext, [
    "attribute_type",
    "attribute_value",
    "tenant_id",
    "password",
    "meta",
  ]);

  return prepareResult;
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    const cie = AccessSDK.getEngine();
    // Validate prepareResult
    // Move all the business logic to a function
    // Abstract the single logic into a reusable function
    const existingAttribute: any = await cie.read("attributes", {
      filterBy: [
        {
          attribute: "type",
          op: "eq",
          value: prepareResult.attribute_type,
        },
        {
          attribute: "value",
          op: "eq",
          value: prepareResult.attribute_value,
        },
        {
          attribute: "tenant_id",
          op: "eq",
          value: prepareResult.tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    if (existingAttribute !== null) {
      return {
        message: "AlreadyRegistered",
      };
    }

    const existingVerification: any = await cie.read("verifications", {
      filterBy: [
        { attribute: "purpose", op: "eq", value: "register" },
        {
          attribute: "attribute_type",
          op: "eq",
          value: prepareResult.attribute_type,
        },
        {
          attribute: "attribute_value",
          op: "eq",
          value: prepareResult.attribute_value,
        },
        {
          attribute: "tenant_id",
          op: "eq",
          value: prepareResult.tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    if (existingVerification === null) {
      const createdUser: any = await cie.create("users", {
        payload: {
          password: prepareResult.password,
          tenant_id: prepareResult.tenant_id,
          meta: prepareResult.meta,
        },
        transformations: ["pick_first"],
      });
      const createdVerification: any = await cie.create("verifications", {
        payload: {
          user_id: createdUser.id,
          attribute_type: prepareResult.attribute_type,
          attribute_value: prepareResult.attribute_value,
          tenant_id: prepareResult.tenant_id,
          purpose: "register",
        },
        transformations: ["pick_first"],
      });

      return {
        message: "SuccessfullyRegistered",
      };
    } else {
      await cie.patch("verifications", {
        payload: {
          id: existingVerification.id,
        },
        transformations: ["pick_first"],
      });

      return {
        message: "AlreadyRegisteredButNotVerified",
      };
    }
  } catch (error) {
    throw error;
  }
};

const respond = ({ handleResult }: StoryExecutionContext) => {
  console.log("handleResult log", handleResult);
  return handleResult;
};

export default {
  prepare,
  authorize,
  handle,
  respond,
};
