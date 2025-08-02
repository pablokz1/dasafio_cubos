import { authMiddleware } from "../../../../api/express/middlewares/auth.middleware";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should return 401 if authorization header is missing", () => {
        req.headers = {};

        authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Authorization header missing or malformed",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if authorization header does not start with Bearer", () => {
        req.headers = { authorization: "Token abc123" };

        authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Authorization header missing or malformed",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token does not contain document", () => {
        req.headers = { authorization: "Bearer validtoken" };

        (jwt.verify as jest.Mock).mockReturnValue({});

        authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Token does not contain document",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next and set req.document if token is valid", () => {
        req.headers = { authorization: "Bearer validtoken" };

        const fakeDocument = "user-document";
        (jwt.verify as jest.Mock).mockReturnValue({ document: fakeDocument });

        authMiddleware(req as Request, res as Response, next);

        expect(req.document).toBe(fakeDocument);
        expect(next).toHaveBeenCalled();
    });

    it("should return 401 if jwt.verify throws", () => {
        req.headers = { authorization: "Bearer invalidtoken" };

        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error("Invalid token");
        });

        authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid or expired token",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
