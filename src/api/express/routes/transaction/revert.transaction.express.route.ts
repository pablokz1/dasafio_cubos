import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { RevertTransactionUseCase } from "../../../../usecases/transaction/revert-transaction.usecase";
import { TransactionRepositoryPrisma } from "../../../../infra/repository/transaction/transaction.repository.prisma";

export class RevertTransactionExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly useCase: RevertTransactionUseCase
    ) { }

    static create(): RevertTransactionExpressRoute {
        const prisma = new PrismaClient();
        const repo = new TransactionRepositoryPrisma(prisma);
        const usecase = new RevertTransactionUseCase(repo);
        return new RevertTransactionExpressRoute(
            "/people/accounts/:accountId/transactions/:transactionId/revert",
            HttpMethod.POST,
            usecase
        );
    }

    getHandler() {
        return async (req: Request, res: Response): Promise<void> => {
            const accountId = req.params.accountId?.trim();
            const transactionId = req.params.transactionId?.trim();

            if (!accountId || !transactionId) {
                res.status(400).json({ message: "Missing accountId or transactionId" });
                return;
            }

            try {
                const output = await this.useCase.execute({ accountId, transactionId });
                res.status(200).json(output);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ message: error.message });
                } else {
                    res.status(500).json({ message: "Internal Server Error" });
                }
            }

        };
    }


    getPath(): string {
        return this.path;
    }

    getMethod(): HttpMethod {
        return this.method;
    }

    getMiddlewares() {
        return [authMiddleware];
    }
}
