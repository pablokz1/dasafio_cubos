import request from "supertest";
import express from "express";
import { ListCardsByPeopleExpressRoute } from "../../../../../api/express/routes/card/list.cards.bypeople.express.route";
import { HttpMethod } from "../../../../../api/express/routes/route";

class ListCardsByPeopleUseCaseMock {
  execute = jest.fn();
}

describe("ListCardsByPeopleExpressRoute - Integration Test", () => {
  let app: express.Express;
  let useCaseMock: ListCardsByPeopleUseCaseMock;

  beforeEach(() => {
    useCaseMock = new ListCardsByPeopleUseCaseMock();

    const route = new ListCardsByPeopleExpressRoute(
      "/people/cards",
      HttpMethod.GET,
      useCaseMock as any
    );

    app = express();
    app.use(express.json());

    app.use((req, res, next) => {
      (req as any).idPeople = "person-123";
      next();
    });

    app.get(route.getPath(), route.getHandler());
  });

  it("should return 200 and paginated cards list", async () => {
    const fakeOutput = {
      cards: [
        {
          id: "card-1",
          type: "physical",
          number: "123456",
          cvv: "123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "card-2",
          type: "virtual",
          number: "654321",
          cvv: "321",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      totalItems: 2,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1,
    };

    useCaseMock.execute.mockResolvedValue(fakeOutput);

    const response = await request(app)
      .get("/people/cards")
      .query({ currentPage: 1, itemsPerPage: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeOutput);
    expect(useCaseMock.execute).toHaveBeenCalledWith({
      personId: "person-123",
      currentPage: 1,
      itemsPerPage: 10,
    });
  });

  it("should return 400 when use case throws a business error", async () => {
    useCaseMock.execute.mockRejectedValue(new Error("Business error"));

    const response = await request(app).get("/people/cards");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Business error" });
  });

  it("should return 500 when unexpected error occurs", async () => {
    useCaseMock.execute.mockRejectedValue("unexpected error");

    const response = await request(app).get("/people/cards");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});
