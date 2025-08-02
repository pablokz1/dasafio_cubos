import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { TransactionRepositoryPrisma } from "../../../../infra/repository/transaction/transaction.repository.prisma";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";
import { CreateTransactionUseCase } from "../../../../usecases/transaction/create-transaction.usecase";

export type CreateTransactionRequestDto = {
    value: number;
    description: string;
};

export type CreateTransactionResponseDto = {
    id: string;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateTransactionExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createTransactionService: CreateTransactionUseCase
    ) { }

    static create(): CreateTransactionExpressRoute {
        const prisma = new PrismaClient();
        const transactionRepository = new TransactionRepositoryPrisma(prisma);
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const createTransactionService = CreateTransactionUseCase.create(transactionRepository, accountsRepository);

        return new CreateTransactionExpressRoute("/people/accounts/:accountId/transactions", HttpMethod.POST, createTransactionService);
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const { value, description } = request.body;
            const { accountId } = request.params;

            try {
                const output = await this.createTransactionService.execute({
                    accountId: accountId!,
                    value,
                    description,
                });

                const responseBody = this.present(output);
                response.status(201).json(responseBody);
            } catch (error) {
                if (error instanceof Error) {
                    response.status(400).json({ message: error.message });
                } else {
                    response.status(500).json({ message: "Internal Server Error" });
                }
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

    private present(input: CreateTransactionResponseDto): CreateTransactionResponseDto {
        return {
            id: input.id,
            value: input.value,
            description: input.description,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        };
    }
}
