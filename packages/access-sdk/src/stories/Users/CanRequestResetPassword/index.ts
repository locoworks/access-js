import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import type { StoryExecutionContext } from "@locoworks/cijson-utils";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "attribute_type",
    "attribute_value",
    "tenant_id",
    "verification_method",
  ]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    const cie = AccessSDK.getEngine();

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

    //check if the email that is getting passed is in the verifications was verified earlier.

    const existingVerification: any = await cie.read("verifications", {
      filterBy: [
        { attribute: "purpose", op: "eq", value: "reset-password" },
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

    if (existingAttribute === null && existingVerification === null) {
      throw {
        statusCode: 422,
        message: "AttributeNotRegistered",
      };
    }

    if (existingAttribute !== null && existingVerification === null) {
      //user exists and has not done the verification earlier, can now create verificition

      const createdVerification: any = await cie.create("verifications", {
        payload: {
          user_id: existingAttribute.user_id,
          attribute_type: prepareResult.attribute_type,
          attribute_value: prepareResult.attribute_value,
          tenant_id: prepareResult.tenant_id,
          purpose: "reset-password",
        },
        transformations: ["pick_first"],
      });
      console.log("Create new verification", createdVerification);
      return {
        message: "SuccessfullyCreatedRequestResetPassword",
      };
    }
    if (existingAttribute !== null && existingVerification !== null) {
      // User exists and can created verification earlier, update verication
      await cie.update("verifications", {
        payload: {
          user_id: existingAttribute.user_id,
          attribute_type: prepareResult.attribute_type,
          attribute_value: prepareResult.attribute_value,
          tenant_id: prepareResult.tenant_id,
          purpose: "reset-password",
        },
        transformations: ["pick_first"],
      });

      return {
        message: "SuccessfullyUpdatedRequestResetPassword",
      };
    }
    return {
      message: "SuccessfullyCreatedRequestResetPassword",
    };
  } catch (error) {
    console.log("error in request rest password", error);
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
