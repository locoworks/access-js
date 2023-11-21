import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import type { StoryExecutionContext } from "@locoworks/cijson-utils";

const isDateInPast = (jsDateTimeString: string, jsDateObject = new Date()) => {
  return new Date(Date.parse(jsDateTimeString + "Z")) < jsDateObject;
};

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "attribute_type",
    "attribute_value",
    "tenant_id",
    "password",
    "token",
  ]);
};

const authorize = () => {
  return true;
};
const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    const cie = AccessSDK.getEngine();
    const accessConfig = AccessSDK.getConfig();

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

    if (existingAttribute === null) {
      return {
        message: "userNotRegistered",
      };
    }
    //Check if user has actually requested for the verification
    if (existingAttribute != null && existingVerification !== null) {
      //check if the token in expired
      if (isDateInPast(existingVerification.expires_at)) {
        let existingVerification2 = await cie.patch("verifications", {
          payload: {
            id: existingVerification.id,
            token: "",
            expires_at: "",
          },
          transformations: ["pick_first"],
        });

        let existingUser = await cie.read("users", {
          filterBy: [
            {
              attribute: "id",
              op: "eq",
              value: existingVerification2.user_id,
            },
          ],
          transformations: ["pick_first"],
        });

        if (accessConfig.eventCallback !== undefined) {
          await accessConfig.eventCallback("user_request_for_reset_password", {
            user: existingUser,
            verification: existingVerification2,
          });
        }

        return {
          message: "TokenExpired",
        };
      }
      //check if the token in valid
      if (prepareResult.token !== existingVerification.token) {
        return {
          message: "InvalidToken",
        };
      }
      // update users password
      await cie.patch("users", {
        payload: {
          id: existingAttribute.user_id,
          password: prepareResult.password,
          tenant_id: prepareResult.tenant_id,
        },
        transformations: ["pick_first"],
      });

      //remove verification
      await cie.delete("verifications", {
        payload: {
          id: existingVerification.id,
        },
        transformations: ["pick_first"],
      });
      return {
        message: "UpdatedNewPasswordSuccessfully",
      };
    } else {
      return {
        message: "NotRequestedForResetPassword",
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
