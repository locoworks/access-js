import {
  CIJConfig as CIConfig,
  CIJEngine as CIEngine,
} from "@locoworks/cijson-engine";
import afterPrepareReadUsers from "./cijson/hooks/afterPrepareReadUsers";
import users from "./cijson/resources/users.json";
import attributes from "./cijson/resources/attributes.json";
import verifications from "./cijson/resources/verifications.json";
import tokens from "./cijson/resources/tokens.json";
import accounts from "./cijson/resources/accounts.json";
import keys from "./cijson/resources/keys.json";
import admins from "./cijson/resources/admins.json";
import timestamps from "./cijson/mixins/timestamps.json";

class AccessSDK {
  private static instance: AccessSDK;
  private static engine: any;

  private constructor() {
    // Private constructor to prevent instantiation outside of this class
  }

  public static getInstance(
    operator: any,
    salt: string | undefined
  ): AccessSDK {
    if (!AccessSDK.instance) {
      AccessSDK.instance = new AccessSDK();
      const ciConfig = new CIConfig();
      if (salt !== undefined) {
        ciConfig.setBCryptSalt(salt);
      }
      ciConfig.registerMixin("timestamps", timestamps);
      ciConfig.registerResource(users);
      ciConfig.registerResource(attributes);
      ciConfig.registerResource(verifications);
      ciConfig.registerResource(tokens);
      ciConfig.registerResource(accounts);
      ciConfig.registerResource(keys);
      ciConfig.registerResource(admins);
      ciConfig.registerHook("afterPrepareReadUsers", afterPrepareReadUsers);
      ciConfig.registerOperator(operator);
      const ciEngine = new CIEngine(ciConfig);
      AccessSDK.engine = ciEngine;
    }
    return AccessSDK.instance;
  }

  public static getEngine(): any {
    return AccessSDK.engine;
  }
}

export default AccessSDK;
