import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthGateway } from "../../../../domain/auth/gateway/auth.gateway";
import { LoginUseCase } from "../../../../usecases/auth/login.usecase";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

export function createMockAuthGateway(): jest.Mocked<AuthGateway> {
    return {
        login: jest.fn(),
        findByDocument: jest.fn(),
    };
}

describe("LoginUseCase", () => {
    let mockAuthGateway: jest.Mocked<AuthGateway>;
    let useCase: LoginUseCase;

    beforeEach(() => {
        mockAuthGateway = createMockAuthGateway();
        useCase = new LoginUseCase(mockAuthGateway);

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call findByDocument, verify password and return a token", async () => {
        mockAuthGateway.findByDocument.mockResolvedValue({
            document: "123",
            password: "hashed-password",
        });

        const token = await useCase.execute({ document: "123", password: "123456" });

        expect(token.token).toBe("fake-jwt-token");
        expect(mockAuthGateway.findByDocument).toHaveBeenCalledWith("123");
        expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed-password");
        expect(jwt.sign).toHaveBeenCalledWith(
            { document: "123" },
            expect.any(String),
            { expiresIn: "1h" }
        );
    });
});
