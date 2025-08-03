import request from "supertest";
import express from "express";
import { CreateCardExpressRoute } from "../../../../../api/express/routes/card/create.card.express.route";

class CreateCardUseCaseMock {
    execute = jest.fn();
}

describe("CreateCardExpressRoute - Integration Test", () => {
    let app: express.Express;
    let createCardUseCaseMock: CreateCardUseCaseMock;

    beforeEach(() => {
        createCardUseCaseMock = new CreateCardUseCaseMock();

        const route = new CreateCardExpressRoute(
            "/people/accounts/:accountId/cards",
            "post",
            createCardUseCaseMock as any
        );

        app = express();
        app.use(express.json());
        app.post(route.getPath(), route.getHandler());
    });

    it("should return 201 and created card data when request is valid", async () => {
        const fakeCard = {
            id: "card-123",
            type: "physical" as "physical" | "virtual",
            number: "1234567890123456",
            cvv: "123",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        createCardUseCaseMock.execute.mockResolvedValue(fakeCard);

        const response = await request(app)
            .post("/people/accounts/account-1/cards")
            .send({
                type: "physical",
                number: "1234567890123456",
                cvv: "123",
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: fakeCard.id,
            type: fakeCard.type,
            number: fakeCard.number,
            cvv: fakeCard.cvv,
            createdAt: fakeCard.createdAt.toISOString(),
            updatedAt: fakeCard.updatedAt.toISOString(),
        });
        expect(createCardUseCaseMock.execute).toHaveBeenCalledWith({
            accountId: "account-1",
            type: "physical",
            number: "1234567890123456",
            cvv: "123",
        });
    });

    it("should return 400 if accountId param is missing", async () => {
        const response = await request(app)
            .post("/people/accounts/ /cards") 
            .send({
                type: "physical",
                number: "1234567890123456",
                cvv: "123",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Parâmetro 'accountId' é obrigatório.",
        });
        expect(createCardUseCaseMock.execute).not.toHaveBeenCalled();
    });

    it("should return 400 when use case throws a business error", async () => {
        createCardUseCaseMock.execute.mockRejectedValue(new Error("Invalid card data"));

        const response = await request(app)
            .post("/people/accounts/account-1/cards")
            .send({
                type: "physical",
                number: "invalidnumber",
                cvv: "123",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid card data" });
        expect(createCardUseCaseMock.execute).toHaveBeenCalled();
    });

    it("should return 500 when unexpected error occurs", async () => {
        createCardUseCaseMock.execute.mockRejectedValue("unexpected error");

        const response = await request(app)
            .post("/people/accounts/account-1/cards")
            .send({
                type: "physical",
                number: "1234567890123456",
                cvv: "123",
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
        expect(createCardUseCaseMock.execute).toHaveBeenCalled();
    });
});
