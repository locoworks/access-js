declare class AccessSDK {
    private static instance;
    private static engine;
    private static accessConfig;
    private constructor();
    static getInstance(operator: any, accessConfig: {
        salt: string | undefined;
        publicKey: string | undefined;
        privateKey: string | undefined;
        jwtExpiry: string | undefined;
    }): AccessSDK;
    static getConfig(): any;
    static getEngine(): any;
}
export default AccessSDK;
