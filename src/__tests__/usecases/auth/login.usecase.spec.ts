import { LoginUseCase } from "../../../usecases/auth/login.usecase";
import { AuthGateway } from "../../../domain/auth/gateway/auth.gateway";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("LoginUseCase", () => {
    const mockAuthGateway: jest.Mocked<AuthGateway> = {
        findByDocument: jest.fn()
    };

    const loginUseCase = new LoginUseCase(mockAuthGateway);

    const mockUser = {
        document: "12345678900",
        password: "hashedPassword"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a token if credentials are valid", async () => {
        mockAuthGateway.findByDocument.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("mocked_token");

        const result = await loginUseCase.execute({
            document: "12345678900",
            password: "plainPassword"
        });

        expect(mockAuthGateway.findByDocument).toHaveBeenCalledWith("12345678900");
        expect(bcrypt.compare).toHaveBeenCalledWith("plainPassword", "hashedPassword");
        expect(jwt.sign).toHaveBeenCalledWith(
            { document: "12345678900" },
            expect.any(String),
            { expiresIn: "1h" }
        );
        expect(result).toEqual({ token: "mocked_token" });
    });

    it("should throw error if document is not found", async () => {
        mockAuthGateway.findByDocument.mockResolvedValue(undefined);

        await expect(
            loginUseCase.execute({ document: "00000000000", password: "any" })
        ).rejects.toThrow("Document not found");

        expect(mockAuthGateway.findByDocument).toHaveBeenCalledWith("00000000000");
    });

    it("should throw error if password is invalid", async () => {
        mockAuthGateway.findByDocument.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(
            loginUseCase.execute({ document: "12345678900", password: "wrongPassword" })
        ).rejects.toThrow("Invalid password");

        expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword");
    });
});
