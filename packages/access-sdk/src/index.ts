import { pahrStrategy } from "@locoworks/cijson-utils";
import UserCanRegisterStory from "./stories/Users/CanRegister";
import UserCanVerifyRegistrationStory from "./stories/Users/VerifyRegistration";
import UserCanCanLoginStory from "./stories/Users/CanLogin";
import UserCanAuthorizeStory from "./stories/Users/Authorize";
import UserCanRequestResetPasswordStory from "./stories/Users/CanRequestResetPassword";
import UserCanResetPasswordStory from "./stories/Users/CanResetPassword";
import UserCanSetPasswordStory from "./stories/Users/CanSetPassword";
import UserCanFetchCurrentUserStory from "./stories/Users/CanFetchCurrentUser";
import UserCanFetchUserStory from "./stories/Users/CanFetchUser";
import UserCanUpdateCurrentUserStory from "./stories/Users/CanUpdateCurrentUser";
import UserCanUpdateUserStory from "./stories/Users/CanUpdateUser";
import UserCanDeleteUserStory from "./stories/Users/CanDeleteUser";
import AccountsCrudStory from "./stories/Accounts/CRUD";
import KeysCrudStory from "./stories/Keys/CRUD";
import AdminsCrudStory from "./stories/Admins/CRUD";
import KeysRecognizeStory from "./stories/Keys/Recognize";
import AccessSDK from "./sdk";

// console.log("users", users);

// Export all functions possible

// How CIJSON will work?
// Write "entities" as JSON files
// Instantiate CIJSON/Engine with those JSON configurations
// Can we import JSON files?
// Instantiate any Operator to do Database operations which will obey CIJSON/CRUDInterface

const UserCanRegister = async (args: any) => {
  let result = await pahrStrategy(UserCanRegisterStory, args);
  return result["respondResult"];
};

const UserCanVerifyRegistration = async (args: any) => {
  let result = await pahrStrategy(UserCanVerifyRegistrationStory, args);
  return result["respondResult"];
};

const UserCanLogin = async (args: any) => {
  let result = await pahrStrategy(UserCanCanLoginStory, args);
  return result["respondResult"];
};
const UserCanRequestResetPassword = async (args: any) => {
  let result = await pahrStrategy(UserCanRequestResetPasswordStory, args);
  return result["respondResult"];
};

const UserCanResetPassword = async (args: any) => {
  let result = await pahrStrategy(UserCanResetPasswordStory, args);
  return result["respondResult"];
};

const UserCanSetPassword = async (args: any) => {
  let result = await pahrStrategy(UserCanSetPasswordStory, args);
  return result["respondResult"];
};

const UserCanFetchCurrentUser = async (args: any) => {
  let result = await pahrStrategy(UserCanFetchCurrentUserStory, args);
  return result["respondResult"];
};

const UserCanFetchUser = async (args: any) => {
  let result = await pahrStrategy(UserCanFetchUserStory, args);
  return result["respondResult"];
};

const UserCanUpdateCurrentUser = async (args: any) => {
  let result = await pahrStrategy(UserCanUpdateCurrentUserStory, args);
  return result["respondResult"];
};

const UserCanUpdateUser = async (args: any) => {
  let result = await pahrStrategy(UserCanUpdateUserStory, args);
  return result["respondResult"];
};

const UserCanDeleteUser = async (args: any) => {
  let result = await pahrStrategy(UserCanDeleteUserStory, args);
  return result["respondResult"];
};

const UserCanAuthorize = async (args: any) => {
  let result = await pahrStrategy(UserCanAuthorizeStory, args);
  return result["respondResult"];
};

const AccountsCrud = async (args: any) => {
  let result = await pahrStrategy(AccountsCrudStory, args);
  return result["respondResult"];
};

const KeysCrud = async (args: any) => {
  let result = await pahrStrategy(KeysCrudStory, args);
  return result["respondResult"];
};

const KeysRecognize = async (args: any) => {
  let result = await pahrStrategy(KeysRecognizeStory, args);
  return result["respondResult"];
};

const AdminsCrud = async (args: any) => {
  let result = await pahrStrategy(AdminsCrudStory, args);
  return result["respondResult"];
};

// const locoFactory = (function () {
//   "use strict";

//   return {
//     init: () => {},
//   };
// })();

// class AccessSDK {
//   private static instance: AccessSDK;
//   private static engine: any;

//   private constructor() {
//     // Private constructor to prevent instantiation outside of this class
//   }

//   public static getInstance(operator: any): AccessSDK {
//     if (!AccessSDK.instance) {
//       AccessSDK.instance = new AccessSDK();
//       const ciConfig = new CIConfig();
//       ciConfig.registerMixin("timestamps", timestamps);
//       ciConfig.registerResource(users);
//       ciConfig.registerResource(attributes);
//       ciConfig.registerResource(verifications);
//       ciConfig.registerResource(tokens);
//       ciConfig.registerHook("afterPrepareReadUsers", afterPrepareReadUsers);
//       ciConfig.registerOperator(operator);
//       const ciEngine = new CIEngine(ciConfig);
//       AccessSDK.engine = ciEngine;
//     }

//     return AccessSDK.instance;
//   }

//   public async UserCanAuthorize(args: any): Promise<any> {
//     args.engine = AccessSDK.engine;
//     return await pahrStrategy(UserCanAuthorizeStory, args);
//   }

//   public async UserCanRegister(args: any): Promise<any> {
//     // args.engine = AccessSDK.engine;
//     return await pahrStrategy(UserCanRegisterStory, args);
//   }

//   public async someMethod(): Promise<any> {
//     console.log("smoethigmethod ......................", AccessSDK.engine);

//     let result = await AccessSDK.engine.read("users", {});

//     console.log("result", result);

//     // Some method implementation
//   }
// }

export {
  UserCanRegister,
  UserCanVerifyRegistration,
  UserCanLogin,
  UserCanRequestResetPassword,
  UserCanResetPassword,
  UserCanSetPassword,
  UserCanAuthorize,
  UserCanFetchCurrentUser,
  UserCanFetchUser,
  UserCanUpdateCurrentUser,
  UserCanUpdateUser,
  UserCanDeleteUser,
  AccountsCrud,
  KeysCrud,
  AdminsCrud,
  KeysRecognize,
  AccessSDK,
};
