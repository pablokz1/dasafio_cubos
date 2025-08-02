import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ListTransactionsByAccountUseCase } from "../../../../usecases/transaction/list-transactions-by-account.usecase";
import { PrismaClient } from "@prisma/client";
import { TransactionRepositoryPrisma } from "../../../../infra/repository/transaction/transaction.repository.prisma";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";

export class ListTransactionsByExpressAccountRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listTransactionsUseCase: ListTransactionsByAccountUseCase
    ) { }

    public static create(): Route {
        const prisma = new PrismaClient();
        const transactionRepository = new TransactionRepositoryPrisma(prisma);
        const listTransactionService = ListTransactionsByAccountUseCase.create(transactionRepository);
        return new ListTransactionsByExpressAccountRoute(
            "/people/accounts/:accountId/transactions",
            HttpMethod.GET,
            listTransactionService
        );
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const { accountId } = request.params;
            if (!accountId) {
                response.status(400).json({ message: "Parâmetro 'accountId' é obrigatório." });
                return;
            }
            const itemsPerPage = parseInt(request.query.itemsPerPage as string) || 10;
            const currentPage = parseInt(request.query.currentPage as string) || 1;
            const type = request.query.type as "credit" | "debit" | undefined;

            try {
                const result = await this.listTransactionsUseCase.execute({
                    accountId,
                    itemsPerPage,
                    currentPage,
                    type,
                });

                response.json(result);
            } catch (error) {
                response
                    .status(400)
                    .json({ message: error instanceof Error ? error.message : "Erro interno" });
            }
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getMiddlewares() {
        return [authMiddleware];
    }
}
