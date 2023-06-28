import type { StoryExecutionContext } from "@locoworks/cijson-utils";
import { pickKeysFromObject, generateRandomKey } from "@locoworks/cijson-utils";
import AccessSDK from "../../../sdk";
import { validatePassword } from "@locoworks/cijson-utils";
import { createTokenForAdmin } from "../../../utils/createToken";
import validateToken from "../../../functions/validateToken";

const prepare = (executionContext: any) => {
  return pickKeysFromObject(executionContext, [
    "action",
    "tenant_id",
    "email",
    "password",
    "permissions",
    "meta",
    "token",
  ]);
};

const authorize = () => {
  return true;
};

const handle = async ({ prepareResult }: StoryExecutionContext) => {
  const cie = AccessSDK.getEngine();

  switch (prepareResult.action) {
    case "create":
      const createdAccount: any = await cie.create("admins", {
        payload: {
          email: prepareResult.email,
          password: prepareResult.password,
          tenant_id: prepareResult.tenant_id,
        },
        transformations: ["pick_first"],
      });

      return createdAccount;
      break;

    case "login":
      const existingAdmin: any = await cie.read("admins", {
        filterBy: [
          {
            attribute: "email",
            op: "eq",
            value: prepareResult.email,
          },
          {
            attribute: "tenant_id",
            op: "eq",
            value: prepareResult.tenant_id,
          },
        ],
        transformations: ["pick_first"],
      });

      if (existingAdmin === null) {
        throw {
          message: "AccountNotFound",
        };
      } else {
        const validPassword = await validatePassword(
          prepareResult.password,
          existingAdmin.password,
          cie.config.bcryptSalt
        );

        if (validPassword) {
          return await createTokenForAdmin(existingAdmin);
        } else {
          throw {
            statusCode: 400,
            message: "Invalid Username or Password",
          };
        }
      }

      break;

    case "validate":
      return await validateToken(
        cie,
        prepareResult.token,
        prepareResult.tenant_id
      );
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
