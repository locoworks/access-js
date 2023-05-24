import type { StoryExecutionContext } from "@locoworks/cijson-utils";
declare const _default: {
    prepare: (executionContext: any) => any;
    authorize: () => boolean;
    handle: ({ prepareResult }: StoryExecutionContext) => Promise<{
        message: string;
    }>;
    respond: ({ handleResult }: StoryExecutionContext) => any;
};
export default _default;
