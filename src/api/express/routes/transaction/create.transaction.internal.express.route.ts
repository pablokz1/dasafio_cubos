import { Request, Response } from "express";
import { CreateInternalTransactionUseCase } from "../../../../usecases/transaction/create-internal-transaction.usecase";
import { HttpMethod, Route } from "../route";
import { CreateTransactionResponseDto } from "./create.transaction.express.route";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";
import { TransactionRepositoryPrisma } from "../../../../infra/repository/transaction/transaction.repository.prisma";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";

export class CreateInternalTransactionExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createTransactionInternalService: CreateInternalTransactionUseCase
    ) { }

    static create(): CreateInternalTransactionExpressRoute {
        const prisma = new PrismaClient();
        const transactionRepository = new TransactionRepositoryPrisma(prisma);
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const createTransactionService = CreateInternalTransactionUseCase.create(transactionRepository, accountsRepository);

        return new CreateInternalTransactionExpressRoute("/people/accounts/:accountId/transactions/internal", HttpMethod.POST, createTransactionService);
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const senderAccountId = request.params.accountId!;
            const { receiverAccountId, value, description } = request.body;

            try {
                const output = await this.createTransactionInternalService.execute({
                    senderAccountId,
                    receiverAccountId,
                    value,
                    description,
                });

                const responseBody = this.present(output);
                response.status(201).json(responseBody);
            } catch (error) {
                response.status(400).json({ message: error instanceof Error ? error.message : "Erro interno" });
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
