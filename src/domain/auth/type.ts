/**
 * Cognito token payload type
 */
export type TokenPayload = Partial<{
    sub:string,
    device_key:string,
    "cognito:groups": string[],
    iss:string,
    client_id:string,
    origin_jti:string,
    token_use:string,
    scope:string,
    auth_time:string,
    exp:string,
    iat:string,
    jti:string,
    username:string,
}>