import { Validate } from "../../../../../../infra/external/domain/validate/entity/validate.entity";
import { ValidateGateway } from "../../../../../../infra/external/domain/validate/gateway/validate.gateway";

describe("ValidateGateway", () => {
    let validateGatewayMock: jest.Mocked<ValidateGateway>;

    beforeEach(() => {
        validateGatewayMock = {
            validateCpf: jest.fn(),
            validateCnpj: jest.fn(),
        };
    });

    it("should call validateCpf with correct arguments and return Validate", async () => {
        const fakeValidate = Validate.with({
            document: "12345678900",
            status: 1,
            reason: "Valid CPF",
        });

        validateGatewayMock.validateCpf.mockResolvedValue(fakeValidate);

        const result = await validateGatewayMock.validateCpf("12345678900", "token123");

        expect(validateGatewayMock.validateCpf).toHaveBeenCalledWith("12345678900", "token123");
        expect(result).toBeInstanceOf(Validate);
        expect(result.document).toBe("12345678900");
    });

    it("should call validateCnpj with correct arguments and return Validate", async () => {
        const fakeValidate = Validate.with({
            document: "12345678000199",
            status: 0,
            reason: "Invalid CNPJ",
        });

        validateGatewayMock.validateCnpj.mockResolvedValue(fakeValidate);

        const result = await validateGatewayMock.validateCnpj("12345678000199", "token456");

        expect(validateGatewayMock.validateCnpj).toHaveBeenCalledWith("12345678000199", "token456");
        expect(result).toBeInstanceOf(Validate);
        expect(result.status).toBe(0);
    });
});
