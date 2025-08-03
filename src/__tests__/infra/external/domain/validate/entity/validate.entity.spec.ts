import { Validate, ValidateProps } from "../../../../../../infra/external/domain/validate/entity/validate.entity";

describe("Validate entity", () => {
    const validProps: ValidateProps = {
        document: "12345678900",
        status: 1,
        reason: "Valid document",
    };

    const invalidProps: ValidateProps = {
        document: "12345678900",
        status: 0,
        reason: "Invalid document",
    };

    it("should create an instance with valid properties", () => {
        const validate = Validate.with(validProps);

        expect(validate).toBeInstanceOf(Validate);
        expect(validate.document).toBe(validProps.document);
        expect(validate.status).toBe(validProps.status);
        expect(validate.reason).toBe(validProps.reason);
    });

    it("should return true for isValid() if status is 1", () => {
        const validate = Validate.with(validProps);
        expect(validate.isValid()).toBe(true);
    });

    it("should return false for isValid() if status is not 1", () => {
        const validate = Validate.with(invalidProps);
        expect(validate.isValid()).toBe(false);
    });
});
