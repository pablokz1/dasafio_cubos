import { Api } from "../api";
import express, { Express } from 'express';
import cors from 'cors';              
import { Route } from "./routes/route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { setupSwagger } from "../swagger";

export class ApiExpress implements Api {
    private app: Express;

    private constructor(routes: Route[]) {
        this.app = express();
        this.app.use(express.json());

        this.app.use(cors({
            origin: 'http://localhost:8000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }));

        this.addRoutes(routes);
    }

    public getApp(): Express {
        return this.app;
    }

    public static create(routes: Route[]) {
        const api = new ApiExpress(routes);
        api.configureMiddleware();
        setupSwagger(api.app);
        return api;
    }

    private addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            const path = route.getPath();
            const method = route.getMethod();
            const handler = route.getHandler();
            const middlewares = route.getMiddlewares ? route.getMiddlewares() : [];

            this.app[method](path, ...middlewares, handler);
        });
    }

    private configureMiddleware(): void {
        this.app.use(errorMiddleware);
    }

    public start(port: number): void {
        this.configureMiddleware();
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
        });
    }
}
