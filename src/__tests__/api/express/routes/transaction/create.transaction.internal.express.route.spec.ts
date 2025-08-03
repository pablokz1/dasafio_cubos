import request from "supertest";
import express from "express";
import { CreateInternalTransactionExpressRoute } from "../../../../../api/express/routes/transaction/create.transaction.internal.express.route";
import { HttpMethod } from "../../../../../api/express/routes/route";

class CreateInternalTransactionUseCaseMock {
    execute = jest.fn();
}

describe("CreateInternalTransactionExpressRoute - Integration Test", () => {
    let app: express.Express;
    let useCaseMock: CreateInternalTransactionUseCaseMock;

    beforeEach(() => {
        useCaseMock = new CreateInternalTransactionUseCaseMock();

        const route = new CreateInternalTransactionExpressRoute(
            "/people/accounts/:accountId/transactions/internal",
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
            value: 200,
            description: "Transferência interna",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        useCaseMock.execute.mockResolvedValue(fakeTransaction);

        const response = await request(app)
            .post("/people/accounts/sender-account-1/transactions/internal")
            .send({
                receiverAccountId: "receiver-account-2",
                value: 200,
                description: "Transferência interna",
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(fakeTransaction);
        expect(useCaseMock.execute).toHaveBeenCalledWith({
            senderAccountId: "sender-account-1",
            receiverAccountId: "receiver-account-2",
            value: 200,
            description: "Transferência interna",
        });
    });

    it("should return 400 when use case throws a business error", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Saldo insuficiente"));

        const response = await request(app)
            .post("/people/accounts/sender-account-1/transactions/internal")
            .send({
                receiverAccountId: "receiver-account-2",
                value: 5000,
                description: "Transferência grande",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Saldo insuficiente" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });

    it("should return 400 when required params are missing", async () => {
        const response = await request(app)
            .post("/people/accounts/sender-account-1/transactions/internal")
            .send({
                value: 100,
                description: "Sem receiverAccountId",
            });

        expect(response.status).toBe(400);
    });
});
