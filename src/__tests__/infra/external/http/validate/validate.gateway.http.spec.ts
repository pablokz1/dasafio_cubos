import axios from "axios";
import { ValidateGatewayHttp } from "../../../../../infra/external/http/validate/validate.gateway.http";
import { Validate } from "../../../../../infra/external/domain/validate/entity/validate.entity";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ValidateGatewayHttp", () => {
    const gateway = new ValidateGatewayHttp();
    const fakeToken = "fake-token";
    const mockCpf = "12345678900";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should validate CPF successfully", async () => {
        const mockData = {
            id: "1",
            document: mockCpf,
            status: "VALID",
        };

        mockedAxios.post.mockResolvedValueOnce({ data: { data: mockData } });

        const result = await gateway.validateCpf(mockCpf, fakeToken);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining("/cpf/validate"),
            { document: mockCpf },
            { headers: { Authorization: `Bearer ${fakeToken}` } }
        );

        expect(result).toBeInstanceOf(Validate);
        expect(result.document).toBe(mockCpf);
    });

    it("should validate CNPJ successfully", async () => {
        const mockCnpj = "12345678000100";
        const mockData = {
            id: "2",
            document: mockCnpj,
            status: "VALID",
        };

        mockedAxios.post.mockResolvedValueOnce({ data: { data: mockData } });

        const result = await gateway.validateCnpj(mockCnpj, fakeToken);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining("/cnpj/validate"),
            { document: mockCnpj },
            { headers: { Authorization: `Bearer ${fakeToken}` } }
        );

        expect(result).toBeInstanceOf(Validate);
        expect(result.document).toBe(mockCnpj);
    });

    it("should retry on failure and throw error after max retries", async () => {
        jest.useFakeTimers();
        mockedAxios.post.mockRejectedValue(new Error("Network error"));

        const promise = gateway.validateCpf(mockCpf, fakeToken);

        await Promise.resolve(); 
        jest.advanceTimersByTime(500);
        await Promise.resolve();
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        jest.advanceTimersByTime(1500);
        await Promise.resolve();

        await expect(promise).rejects.toThrow("Invalid document.");
        expect(mockedAxios.post).toHaveBeenCalledTimes(3);

        jest.useRealTimers();
    }, 5000);
});
