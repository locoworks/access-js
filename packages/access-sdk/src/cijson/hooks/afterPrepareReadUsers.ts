import { Config, Context } from "@locoworks/cijson-engine/types";

const afterPrepareReadUsers = (config: Config, context: Context) => {
	// console.log("afterPrepareReadUsers called");
	return context;
};

export default afterPrepareReadUsers;
