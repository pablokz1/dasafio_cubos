import axios from "axios";
import { AuthGatewayHttp } from "../../../../../infra/external/http/auth/auth.gateway.http";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthGatewayHttp", () => {
    const gateway = new AuthGatewayHttp();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should requestCode and return userId and authCode", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                data: {
                    userId: "user-123",
                    authCode: "code-456",
                },
            },
        });

        const result = await gateway.requestCode();

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining("/auth/code"),
            expect.objectContaining({
                email: process.env.EMAIL,
                password: process.env.SENHA,
            })
        );
        expect(result).toEqual({ userId: "user-123", authCode: "code-456" });
    });

    it("should requestToken and return tokens", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                data: {
                    idToken: "id-token",
                    accessToken: "access-token",
                    refreshToken: "refresh-token",
                },
            },
        });

        const result = await gateway.requestToken("authCode123");

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining("/auth/token"),
            { authCode: "authCode123" }
        );
        expect(result).toEqual({
            idToken: "id-token",
            accessToken: "access-token",
            refreshToken: "refresh-token",
        });
    });

    it("should refreshToken and return new accessToken", async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                data: {
                    accessToken: "new-access-token",
                },
            },
        });

        const result = await gateway.refreshToken("refresh-token-abc");

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining("/auth/refresh"),
            { refreshToken: "refresh-token-abc" }
        );
        expect(result).toEqual({ accessToken: "new-access-token" });
    });
});
