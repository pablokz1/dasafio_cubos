import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { PrismaClient } from "@prisma/client";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";
import { GetBalanceUseCase } from "../../../../usecases/account/get-balance.usecase";
import { authMiddleware } from "../../middlewares/auth.middleware";

type BalanceResponseDTO = {
    balance: number;
};

export class GetBalanceAccountExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly usecase: GetBalanceUseCase
    ) { }

    static create() {
        const prisma = new PrismaClient();
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const usecase = new GetBalanceUseCase(accountsRepository);
        return new GetBalanceAccountExpressRoute("/people/accounts/:accountId/balance", HttpMethod.GET, usecase);
    }

    public getHandler() {
        return async (req: Request, res: Response): Promise<void> => {
            const { accountId } = req.params;

            if (!accountId) {
                res.status(400).json({ message: "Parâmetro 'accountId' é obrigatório." });
                return;
            }

            try {
                const result = await this.usecase.execute({ accountId });
                const response = this.present(result);
                res.status(200).json(response);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ message: error.message });
                } else {
                    res.status(500).json({ message: "Internal Server Error" });
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

    private present(input: BalanceResponseDTO): BalanceResponseDTO {
        return {
            balance: input.balance,
        };
    }
}
