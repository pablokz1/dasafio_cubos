import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

import { ListAccountsByPeopleExpressRoute } from "../../../../../api/express/routes/accounts/list.account.bypeople.express.route";

jest.mock("jsonwebtoken");

describe("ListAccountsByPeopleExpressRoute - Integration Test", () => {
    let app;
    let mockUseCaseExecute;
    let mockPeopleRepositoryFindByDocument;

    const mockAuthMiddleware = (req, res, next) => {
        next();
    };

    beforeAll(() => {
        mockUseCaseExecute = jest.fn();

        mockPeopleRepositoryFindByDocument = jest.fn();

        const route = new ListAccountsByPeopleExpressRoute(
            "/people/accounts",
            "get",
            { execute: mockUseCaseExecute },
            { findByDocument: mockPeopleRepositoryFindByDocument }
        );

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

    it("should return 200 and accounts list when authenticated and person found", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ document: "12345678900" });

        mockPeopleRepositoryFindByDocument.mockResolvedValue({ id: "person-1" });

        const accounts = [
            {
                id: "acc-1",
                branch: "001",
                account: "12345",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "acc-2",
                branch: "002",
                account: "67890",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        mockUseCaseExecute.mockResolvedValue({ accounts });

        const response = await request(app)
            .get("/people/accounts")
            .set("Authorization", "Bearer faketoken");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ accounts });
        expect(jwt.verify).toHaveBeenCalledWith("faketoken", expect.any(String));
        expect(mockPeopleRepositoryFindByDocument).toHaveBeenCalledWith("12345678900");
        expect(mockUseCaseExecute).toHaveBeenCalledWith({ idPeople: "person-1" });
    });

    it("should return 401 if Authorization header is missing", async () => {
        const response = await request(app).get("/people/accounts");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Authorization header missing" });
    });

    it("should return 401 if token is missing in Authorization header", async () => {
        const response = await request(app).get("/people/accounts").set("Authorization", "Bearer");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Token missing" });
    });

    it("should return 401 if token is invalid", async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error("invalid token");
        });

        const response = await request(app).get("/people/accounts").set("Authorization", "Bearer invalidtoken");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Invalid token" });
    });

    it("should return 401 if document is missing in token", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({});

        const response = await request(app).get("/people/accounts").set("Authorization", "Bearer validtoken");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Document missing in token" });
    });

    it("should return 404 if person not found", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ document: "12345678900" });
        mockPeopleRepositoryFindByDocument.mockResolvedValue(null);

        const response = await request(app).get("/people/accounts").set("Authorization", "Bearer validtoken");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Person not found" });
    });

    it("should return 400 if usecase throws an Error", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ document: "12345678900" });
        mockPeopleRepositoryFindByDocument.mockResolvedValue({ id: "person-1" });
        mockUseCaseExecute.mockRejectedValue(new Error("Bad request"));

        const response = await request(app).get("/people/accounts").set("Authorization", "Bearer validtoken");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Bad request" });
    });

    it("should return 500 if unknown error is thrown", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ document: "12345678900" });
        mockPeopleRepositoryFindByDocument.mockResolvedValue({ id: "person-1" });
        mockUseCaseExecute.mockRejectedValue("unknown error");

        const response = await request(app).get("/people/accounts").set("Authorization", "Bearer validtoken");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal Server Error" });
    });
});
