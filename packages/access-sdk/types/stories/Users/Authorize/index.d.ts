import type { StoryExecutionContext } from "@locoworks/cijson-utils";
declare const _default: {
    prepare: (executionContext: any) => any;
    authorize: () => boolean;
    handle: ({ prepareResult }: StoryExecutionContext) => Promise<{
        token: any;
        decoded: import("jose").JWTPayload;
        user: any;
        admin?: undefined;
    } | {
        token: any;
        decoded: import("jose").JWTPayload;
        admin: any;
        user?: undefined;
    } | undefined>;
    respond: ({ handleResult }: StoryExecutionContext) => any;
};
export default _default;
