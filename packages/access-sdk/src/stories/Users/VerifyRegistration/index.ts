import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import { createTokenForUser } from "../../../utils/createToken";

const isDateInPast = (jsDateTimeString: string, jsDateObject = new Date()) => {
  return new Date(Date.parse(jsDateTimeString + "Z")) < jsDateObject;
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

    if (existingAttribute !== null) {
      return {
        message: "AlreadyRegistered",
      };
    }

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
        {
          attribute: "tenant_id",
          op: "eq",
          value: prepareResult.tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    if (existingVerification !== null) {
      // If verification is present, then check if token is valid and date is not in past
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
          accessConfig.eventCallback("user_registered", {
            scenario: "verification",
            user: existingUser,
            verification: existingVerification2,
          });
        }

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

      const user: any = await cie.read("users", {
        filterBy: [
          {
            attribute: "id",
            op: "eq",
            value: existingVerification.user_id,
          },
        ],
        transformations: ["pick_first"],
      });

      const token = await createTokenForUser(user);

      return {
        message: "VerifiedSuccessfully",
        ...token,
      };
    } else {
      // If verification is not present, then user didn't register yet
      return {
        message: "NotRegistered",
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
