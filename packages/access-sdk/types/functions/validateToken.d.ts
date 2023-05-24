declare const validateToken: (cie: any, bearerToken: string, tenant_id: string) => Promise<{
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
export default validateToken;
