import { Request, Response, NextFunction } from "express";
import { errorMiddleware } from "../../../../api/express/middlewares/error.middleware";

describe("errorMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should respond with provided status and message", () => {
        const error = { status: 404, message: "Not Found" };

        errorMiddleware(error, req as Request, res as Response, next);

        expect(console.error).toHaveBeenCalledWith("[ErrorMiddleware]", error);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            message: "Not Found",
        });
    });

    it("should respond with 500 and default message if no status/message provided", () => {
        const error = {};

        errorMiddleware(error, req as Request, res as Response, next);

        expect(console.error).toHaveBeenCalledWith("[ErrorMiddleware]", error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            message: "Internal Server Error",
        });
    });
});
