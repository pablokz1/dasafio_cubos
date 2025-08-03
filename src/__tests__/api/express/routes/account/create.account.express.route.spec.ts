import express from "express";
import request from "supertest";
import { CreateAccountExpressRoute } from "../../../../../api/express/routes/accounts/create.account.express.route";
import { CreateAccountUseCase } from "../../../../../usecases/account/create-account.usecase";

const mockExecute = jest.fn();

jest.mock("../../../../../usecases/account/create-account.usecase", () => ({
  CreateAccountUseCase: {
    create: jest.fn(() => ({
      execute: mockExecute,
    })),
  },
}));

const mockAuthMiddleware = (req, res, next) => {
  req.document = "12345678900";
  next();
};

describe("CreateAccountExpressRoute - Integration Test", () => {
  let app;

  beforeAll(() => {
    const route = CreateAccountExpressRoute.create();
    app = express();
    app.use(express.json());

    app.post(route.getPath(), mockAuthMiddleware, route.getHandler());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and created account response", async () => {
    mockExecute.mockResolvedValue({
      id: "account-1",
      branch: "001",
      account: "123456-7",
    });

    const response = await request(app)
      .post("/people/accounts")
      .send({
        branch: "001",
        account: "123456-7",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: "account-1",
      branch: "001",
      account: "123456-7",
    });
    expect(mockExecute).toHaveBeenCalledWith({
      branch: "001",
      account: "123456-7",
      document: "12345678900",
    });
  });

  it("should return 400 when use case throws error", async () => {
    mockExecute.mockRejectedValue(new Error("Invalid data"));

    const response = await request(app)
      .post("/people/accounts")
      .send({
        branch: "002",
        account: "765432-1",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid data" });
    expect(mockExecute).toHaveBeenCalled();
  });

  it("should return 500 when unknown error thrown", async () => {
    mockExecute.mockRejectedValue("unknown error");

    const response = await request(app)
      .post("/people/accounts")
      .send({
        branch: "003",
        account: "111222-3",
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
    expect(mockExecute).toHaveBeenCalled();
  });
});
