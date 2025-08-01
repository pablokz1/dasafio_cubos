export interface AuthGateway {
    requestCode(): Promise<{ userId: string; authCode: string }>;
    requestToken(authCode: string): Promise<{ idToken: string; accessToken: string; refreshToken: string }>;
    refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
}
