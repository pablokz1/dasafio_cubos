import request from "supertest";
import express from "express";
import { CreateTransactionExpressRoute } from "../../../../../api/express/routes/transaction/create.transaction.express.route";
import { HttpMethod } from "../../../../../api/express/routes/route";

class CreateTransactionUseCaseMock {
    execute = jest.fn();
}

describe("CreateTransactionExpressRoute - Integration Test", () => {
    let app: express.Express;
    let useCaseMock: CreateTransactionUseCaseMock;

    beforeEach(() => {
        useCaseMock = new CreateTransactionUseCaseMock();

        const route = new CreateTransactionExpressRoute(
            "/people/accounts/:accountId/transactions",
            HttpMethod.POST,
            useCaseMock as any
        );

        app = express();
        app.use(express.json());

        app.use((req, res, next) => {
            next();
        });

        app.post(route.getPath(), route.getHandler());
    });

    it("should return 201 and transaction data when request is valid", async () => {
        const fakeTransaction = {
            id: "tx-123",
            value: 100,
            description: "Test transaction",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        useCaseMock.execute.mockResolvedValue(fakeTransaction);

        const response = await request(app)
            .post("/people/accounts/account-1/transactions")
            .send({
                value: 100,
                description: "Test transaction",
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(fakeTransaction);
        expect(useCaseMock.execute).toHaveBeenCalledWith({
            accountId: "account-1",
            value: 100,
            description: "Test transaction",
        });
    });

    it("should return 400 when use case throws a business error", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Business error"));

        const response = await request(app)
            .post("/people/accounts/account-1/transactions")
            .send({
                value: 100,
                description: "Invalid transaction",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Business error" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });

    it("should return 500 when unexpected error occurs", async () => {
        useCaseMock.execute.mockRejectedValue("unexpected error");

        const response = await request(app)
            .post("/people/accounts/account-1/transactions")
            .send({
                value: 100,
                description: "Test transaction",
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });
});
