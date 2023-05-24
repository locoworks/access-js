import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import { validatePassword } from "@locoworks/cijson-utils";
import { createTokenForUser } from "../../../utils/createToken";
import AccessSDK from "../../../sdk";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "attribute_type",
    "attribute_value",
    "tenant_id",
    "password",
  ]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  try {
    // Find attribute based on email for tenant
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

    const existingVerification: any = await cie.read("verifications", {
      filterBy: [
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

    // Find verification based on email for tenant

    if (existingAttribute === null && existingVerification !== null) {
      throw {
        statusCode: 422,
        message: "AttributeNotVerified",
      };
    }

    if (existingAttribute === null && existingVerification === null) {
      throw {
        statusCode: 422,
        message: "AttributeNotRegistered",
      };
    }

    // console.log(
    // 	"existingAttribute.user_id,",
    // 	existingAttribute.user_id,
    // 	prepareResult.tenant_id,
    // );

    const user: any = await cie.read("users", {
      filterBy: [
        {
          attribute: "id",
          op: "eq",
          value: existingAttribute.user_id,
        },
        {
          attribute: "tenant_id",
          op: "eq",
          value: prepareResult.tenant_id,
        },
      ],
      transformations: ["pick_first"],
    });

    const validPassword = await validatePassword(
      prepareResult.password,
      user.password
    );

    if (validPassword) {
      return await createTokenForUser(user);
    } else {
      throw {
        statusCode: 400,
        message: "Invalid Username or Password",
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
