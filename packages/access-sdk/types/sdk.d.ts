declare class AccessSDK {
    private static instance;
    private static engine;
    private constructor();
    static getInstance(operator: any): AccessSDK;
    static getEngine(): any;
}
export default AccessSDK;
