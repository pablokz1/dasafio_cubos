import { Auth } from "../../../../domain/auth/entity/auth.entity";

describe("Auth Entity", () => {
    const validDocument = "12345678900";

    describe("create", () => {
        it("should create an Auth instance with valid document and password", () => {
            const auth = Auth.create(validDocument, "strongPassword");
            expect(auth.document).toBe(validDocument);
            expect(auth.password).toBe("strongPassword");
        });

        it("should throw an error if password is less than 6 characters", () => {
            expect(() => {
                Auth.create(validDocument, "12345");
            }).toThrow("Password must be at least 6 characters.");
        });

        it("should throw an error if password is empty", () => {
            expect(() => {
                Auth.create(validDocument, "");
            }).toThrow("Password must be at least 6 characters.");
        });
    });

    describe("with", () => {
        it("should create an Auth instance from props", () => {
            const props = { document: validDocument, password: "strongPassword" };
            const auth = Auth.with(props);
            expect(auth.document).toBe(validDocument);
            expect(auth.password).toBe("strongPassword");
        });
    });

    describe("getters", () => {
        it("should return the correct property values", () => {
            const props = { document: validDocument, password: "strongPassword" };
            const auth = Auth.with(props);

            expect(auth.document).toBe(props.document);
            expect(auth.password).toBe(props.password);
        });
    });
});