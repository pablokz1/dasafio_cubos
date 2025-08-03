import request from "supertest";
import express from "express";
import { ListTransactionsByExpressAccountRoute } from "../../../../../api/express/routes/transaction/list.transactions.byaccount.express.route";
import { HttpMethod } from "../../../../../api/express/routes/route";

class ListTransactionsByAccountUseCaseMock {
    execute = jest.fn();
}

describe("ListTransactionsByExpressAccountRoute - Integration Test", () => {
    let app: express.Express;
    let useCaseMock: ListTransactionsByAccountUseCaseMock;

    beforeEach(() => {
        useCaseMock = new ListTransactionsByAccountUseCaseMock();

        const route = new ListTransactionsByExpressAccountRoute(
            "/people/accounts/:accountId/transactions",
            HttpMethod.GET,
            useCaseMock as any
        );

        app = express();
        app.use(express.json());
        app.get(route.getPath(), route.getHandler());
    });

    it("should return 200 and list of transactions", async () => {
        const fakeTransactions = [
            {
                id: "tx-1",
                value: 100,
                description: "Depósito",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                type: "credit",
            },
            {
                id: "tx-2",
                value: 50,
                description: "Saque",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                type: "debit",
            },
        ];

        useCaseMock.execute.mockResolvedValue(fakeTransactions);

        const response = await request(app)
            .get("/people/accounts/account-123/transactions")
            .query({ itemsPerPage: "5", currentPage: "1", type: "credit" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeTransactions);
        expect(useCaseMock.execute).toHaveBeenCalledWith({
            accountId: "account-123",
            itemsPerPage: 5,
            currentPage: 1,
            type: "credit",
        });
    });

    it("should return 400 if accountId param is missing", async () => {
        const response = await request(app)
            .get("/people/accounts/ /transactions");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Parâmetro 'accountId' é obrigatório.",
        });
        expect(useCaseMock.execute).not.toHaveBeenCalled();
    });

    it("should return 400 when use case throws a business error", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Erro de negócio"));

        const response = await request(app)
            .get("/people/accounts/account-123/transactions");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Erro de negócio" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });
});
