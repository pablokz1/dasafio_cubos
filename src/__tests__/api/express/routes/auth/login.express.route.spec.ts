import request from "supertest";
import express from "express";
import { LoginExpressRoute } from "../../../../../api/express/routes/auth/login.express.route";
import { LoginUseCase } from "../../../../../usecases/auth/login.usecase";

class LoginUseCaseMock {
    execute = jest.fn();
}

describe("LoginExpressRoute - Integration Test", () => {
    let app: express.Express;
    let loginUseCaseMock: LoginUseCaseMock;

    beforeEach(() => {
        loginUseCaseMock = new LoginUseCaseMock();

        const loginRoute = new LoginExpressRoute(
            "/login",
            "post",
            loginUseCaseMock as any
        );

        app = express();
        app.use(express.json());
        app.post(loginRoute.getPath(), loginRoute.getHandler());
    });

    it("should return 200 and token when login is successful", async () => {
        const fakeToken = "fake.jwt.token";
        loginUseCaseMock.execute.mockResolvedValue({ token: fakeToken });

        const response = await request(app)
            .post("/login")
            .send({ document: "12345678901", password: "password123" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ token: fakeToken });
        expect(loginUseCaseMock.execute).toHaveBeenCalledWith({
            document: "12345678901",
            password: "password123",
        });
    });

    it("should return 401 when login fails with invalid credentials", async () => {
        loginUseCaseMock.execute.mockRejectedValue(new Error("Invalid credentials"));

        const response = await request(app)
            .post("/login")
            .send({ document: "wrong", password: "wrongpass" });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Invalid credentials" });
        expect(loginUseCaseMock.execute).toHaveBeenCalledWith({
            document: "wrong",
            password: "wrongpass",
        });
    });

    it("should return 500 for unexpected errors", async () => {
        loginUseCaseMock.execute.mockRejectedValue("some unexpected error");

        const response = await request(app)
            .post("/login")
            .send({ document: "12345678901", password: "password123" });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
        expect(loginUseCaseMock.execute).toHaveBeenCalledWith({
            document: "12345678901",
            password: "password123",
        });
    });
});
