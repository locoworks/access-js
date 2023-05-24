declare const createTokenForUser: (user: any) => Promise<{
    access_token: string;
}>;
declare const createTokenForAdmin: (admin: any) => Promise<{
    access_token: string;
}>;
export { createTokenForUser, createTokenForAdmin };
