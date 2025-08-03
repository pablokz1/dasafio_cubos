import request from "supertest";
import express from "express";
import { ListCardsByAccountExpressRoute } from "../../../../../api/express/routes/card/list.cards.byaccount.express.route";
import { HttpMethod } from "../../../../../api/express/routes/route";

class ListCardsByAccountUseCaseMock {
    execute = jest.fn();
}

describe("ListCardsByAccountExpressRoute - Integration Test", () => {
    let app: express.Express;
    let useCaseMock: ListCardsByAccountUseCaseMock;

    beforeEach(() => {
        useCaseMock = new ListCardsByAccountUseCaseMock();

        const route = new ListCardsByAccountExpressRoute(
            "/people/accounts/:accountId/cards",
            HttpMethod.GET,
            useCaseMock as any
        );

        app = express();
        app.use(express.json());
        app.get(route.getPath(), route.getHandler());
    });

    it("should return 200 and list of cards", async () => {
        const fakeCards = [
            {
                id: "card-1",
                type: "physical",
                number: "123456",
                cvv: "123",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "card-2",
                type: "virtual",
                number: "654321",
                cvv: "321",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        useCaseMock.execute.mockResolvedValue(fakeCards);

        const response = await request(app).get("/people/accounts/account-1/cards");

        const expectedBody = fakeCards.map(card => ({
            ...card,
            createdAt: card.createdAt.toISOString(),
            updatedAt: card.updatedAt.toISOString(),
        }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedBody);
        expect(useCaseMock.execute).toHaveBeenCalledWith({ accountId: "account-1" });
    });

    it("should return 400 if accountId param is missing or empty", async () => {
        const response = await request(app).get("/people/accounts/ /cards");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "accountId is required" });
        expect(useCaseMock.execute).not.toHaveBeenCalled();
    });

    it("should return 400 when use case throws a business error", async () => {
        useCaseMock.execute.mockRejectedValue(new Error("Business error"));

        const response = await request(app).get("/people/accounts/account-1/cards");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Business error" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });

    it("should return 500 when unexpected error occurs", async () => {
        useCaseMock.execute.mockRejectedValue("unexpected error");

        const response = await request(app).get("/people/accounts/account-1/cards");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
        expect(useCaseMock.execute).toHaveBeenCalled();
    });
});
