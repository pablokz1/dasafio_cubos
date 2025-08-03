import { AuthGateway } from "../../../../../../infra/external/domain/auth/gateway/auth.gateway";

export const authGatewayMock: jest.Mocked<AuthGateway> = {
    requestCode: jest.fn().mockResolvedValue({
        userId: "user-123",
        authCode: "authcode-abc",
    }),

    requestToken: jest.fn().mockImplementation(async (authCode: string) => {
        if (authCode === "valid-code") {
            return {
                idToken: "id-token",
                accessToken: "access-token",
                refreshToken: "refresh-token",
            };
        }
        throw new Error("Invalid auth code");
    }),

    refreshToken: jest.fn().mockImplementation(async (refreshToken: string) => {
        if (refreshToken === "valid-refresh-token") {
            return { accessToken: "new-access-token" };
        }
        throw new Error("Invalid refresh token");
    }),
};


describe("SomeService tests", () => {
    it("should call requestCode and return userId and authCode", async () => {
        const result = await authGatewayMock.requestCode();

        expect(result.userId).toBe("user-123");
        expect(result.authCode).toBe("authcode-abc");
        expect(authGatewayMock.requestCode).toHaveBeenCalled();
    });

    it("should throw error on invalid auth code in requestToken", async () => {
        await expect(authGatewayMock.requestToken("invalid")).rejects.toThrow("Invalid auth code");
    });

    it("should return new access token on valid refresh token", async () => {
        const result = await authGatewayMock.refreshToken("valid-refresh-token");

        expect(result.accessToken).toBe("new-access-token");
    });
});
