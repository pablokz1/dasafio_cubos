import { Auth } from "../../../../../../infra/external/domain/auth/entity/auth.entity";

describe("Auth entity", () => {
    describe("create method", () => {
        it("should create Auth instance with valid email and password", () => {
            const email = "test@example.com";
            const password = "123456";
            const auth = Auth.create(email, password);

            expect(auth).toBeInstanceOf(Auth);
            expect(auth.email).toBe(email);
            expect(auth.password).toBe(password);
        });

        it("should throw error if email is invalid", () => {
            expect(() => Auth.create("", "123456")).toThrow("Invalid email.");
            expect(() => Auth.create("invalid-email", "123456")).toThrow("Invalid email.");
            expect(() => Auth.create("invalid@.com", "123456")).toThrow("Invalid email.");
        });

        it("should throw error if password is missing or less than 6 chars", () => {
            expect(() => Auth.create("test@example.com", "")).toThrow(
                "Password must be at least 6 characters."
            );
            expect(() => Auth.create("test@example.com", "123")).toThrow(
                "Password must be at least 6 characters."
            );
        });

        it("should accept optional role parameter but not store it (since not used internally)", () => {
            const auth = Auth.create("user@example.com", "123456", "admin");
            expect(auth).toBeInstanceOf(Auth);
            expect(auth.email).toBe("user@example.com");
            expect(auth.password).toBe("123456");
        });
    });

    describe("with method", () => {
        it("should create Auth instance from props", () => {
            const props = { email: "with@example.com", password: "abcdef" };
            const auth = Auth.with(props);

            expect(auth).toBeInstanceOf(Auth);
            expect(auth.email).toBe(props.email);
            expect(auth.password).toBe(props.password);
        });
    });

    describe("validateEmail private method", () => {
        it("should validate emails correctly via create method", () => {
            expect(() => Auth.create("valid@example.com", "123456")).not.toThrow();
            expect(() => Auth.create("invalid-email", "123456")).toThrow("Invalid email.");
        });
    });
});
