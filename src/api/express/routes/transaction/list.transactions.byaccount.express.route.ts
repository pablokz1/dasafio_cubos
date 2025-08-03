import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ListTransactionsByAccountUseCase, ListTransactionsOutputDto } from "../../../../usecases/transaction/list-transactions-by-account.usecase";
import { PrismaClient } from "@prisma/client";
import { TransactionRepositoryPrisma } from "../../../../infra/repository/transaction/transaction.repository.prisma";

type TransactionResponseDTO = {
    id: string;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

type ListTransactionsByAccountResponseDTO = {
    transactions: TransactionResponseDTO[];
    pagination: {
        itemsPerPage: number;
        currentPage: number;
    };
};

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
            const accountId = request.params.accountId;
            if (!accountId || accountId.trim() === "") {
                response.status(400).json({ message: "'accountId' parameter is mandatory." });
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

                const responseDto = this.present(result);
                response.json(responseDto);
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

    private present(input: ListTransactionsByAccountResponseDTO): ListTransactionsByAccountResponseDTO {
        return {
            transactions: input.transactions.map(tx => ({
                id: tx.id,
                value: tx.value,
                description: tx.description,
                createdAt: tx.createdAt,
                updatedAt: tx.updatedAt,
            })),
            pagination: input.pagination,
        };
    }

}
