import request from "supertest";
import express from "express";
import { RevertTransactionExpressRoute } from "../../../../../api/express/routes/transaction/revert.transaction.express.route";

class RevertTransactionUseCaseMock {
    execute = jest.fn();
}

describe("RevertTransactionExpressRoute - Integration Test", () => {
    let app: express.Express;
    let useCaseMock: RevertTransactionUseCaseMock;

    beforeEach(() => {
        useCaseMock = new RevertTransactionUseCaseMock();

        const route = new RevertTransactionExpressRoute(
            "/people/accounts/:accountId/transactions/:transactionId/revert",
            "post",
            useCaseMock as any
        );

        app = express();
        app.use(express.json());
        app.post(route.getPath(), route.getHandler());
    });

    it("should return 200 and the revert output when request is valid", async () => {
        const fakeOutput = {
            id: "transaction-123",
            value: 100,
            description: "Reverted transaction",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        useCaseMock.execute.mockResolvedValue(fakeOutput);

        const response = await request(app)
            .post("/people/accounts/account-1/transactions/transaction-123/revert")
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeOutput);
        expect(useCaseMock.execute).toHaveBeenCalledWith({
            accountId: "account-1",
            transactionId: "transaction-123",
        });
    });

    it("should return 400 if accountId or transactionId is missing or empty", async () => {
        let response = await request(app)
            .post("/people/accounts/ /transactions/transaction-123/revert")
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Missing accountId or transactionId" });
        expect(useCaseMock.execute).not.toHaveBeenCalled();

        response = await request(app)
            .post("/people/accounts/account-1/transactions/ /revert")
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Missing accountId or transactionId" });
        expect(useCaseMock.execute).not.toHaveBeenCalled();
    });


    it("should return 400 when use case throws a business error", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Business error"));

        const response = await request(app)
            .post("/people/accounts/account-1/transactions/transaction-123/revert")
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Business error" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });

    it("should return 500 when unexpected error occurs", async () => {
        useCaseMock.execute.mockRejectedValue("Unexpected error");

        const response = await request(app)
            .post("/people/accounts/account-1/transactions/transaction-123/revert")
            .send();

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });
});
