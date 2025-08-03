import express from "express";
import request from "supertest";
import { GetBalanceAccountExpressRoute } from "../../../../../api/express/routes/accounts/get-balance.account.express.route";
import { GetBalanceUseCase } from "../../../../../usecases/account/get-balance.usecase";

jest.mock("../../../../../usecases/account/get-balance.usecase");

const mockExecute = jest.fn();

(GetBalanceUseCase as jest.Mock).mockImplementation(() => ({
    execute: mockExecute,
}));

const mockAuthMiddleware = (req, res, next) => {
    req.document = "any-document";
    next();
};

describe("GetBalanceAccountExpressRoute - Integration Test", () => {
    let app;

    beforeAll(() => {
        const route = GetBalanceAccountExpressRoute.create();
        app = express();
        app.use(express.json());

        app.get(
            route.getPath(),
            mockAuthMiddleware,
            route.getHandler()
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 and balance when accountId is valid", async () => {
        mockExecute.mockResolvedValue({ balance: 123.45 });

        const response = await request(app).get("/people/accounts/account-123/balance");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ balance: 123.45 });
        expect(mockExecute).toHaveBeenCalledWith({ accountId: "account-123" });
    });

    it("should return 400 if accountId is missing", async () => {
        app.get("/people/accounts//balance", mockAuthMiddleware, (req, res) => {
            res.status(400).json({ message: "Parâmetro 'accountId' é obrigatório." });
        });

        const response = await request(app).get("/people/accounts//balance");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Parâmetro 'accountId' é obrigatório." });
    });

    it("should return 404 when usecase throws error", async () => {
        mockExecute.mockRejectedValue(new Error("Account not found"));

        const response = await request(app).get("/people/accounts/account-999/balance");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Account not found" });
    });

    it("should return 500 when unknown error thrown", async () => {
        mockExecute.mockRejectedValue("unexpected error");

        const response = await request(app).get("/people/accounts/account-999/balance");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
    });
});
