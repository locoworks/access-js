import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";

const isDateInPast = (jsDateTimeString: string, jsDateObject = new Date()) => {
  console.log("isDateInPast", new Date(jsDateTimeString), jsDateObject);
  return new Date(jsDateTimeString) < jsDateObject;
};

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "attribute_type",
    "attribute_value",
    "tenant_id",
    "token",
  ]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    const cie = AccessSDK.getEngine();
    console.log("prepareResult in VerifyRegistration", prepareResult);
    // Find if there is an existing verification, by type/value
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
      ],
      transformations: ["pick_first"],
    });

    if (existingVerification !== null) {
      // If verification is present, then check if token is valid and date is not in past
      if (isDateInPast(existingVerification.expires_at)) {
        return {
          message: "TokenExpired",
        };
      }
      if (prepareResult.token !== existingVerification.token) {
        return {
          message: "InvalidToken",
        };
      }
      // Create an attribute, Find the user, remove verification

      await cie.create("attributes", {
        payload: {
          type: existingVerification.attribute_type,
          value: existingVerification.attribute_value,
          user_id: existingVerification.user_id,
          tenant_id: prepareResult.tenant_id,
        },
        transformations: ["pick_first"],
      });

      await cie.delete("verifications", {
        payload: {
          id: existingVerification.id,
        },
        transformations: ["pick_first"],
      });

      return {
        message: "VerifiedSuccessfully",
      };
    } else {
      // If verification is not present, then user didn't register yet
      return {
        message: "InvalidToken",
      };
    }
  } catch (error) {
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
