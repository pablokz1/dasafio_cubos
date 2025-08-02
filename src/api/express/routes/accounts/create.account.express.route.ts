import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateAccountUseCase } from "../../../../usecases/accounts/create-account.usecase";
import { PrismaClient } from "@prisma/client";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { PeopleRepositoryPrisma } from "../../../../infra/repository/people/people.repository.prisma";

export type CreateAccountRequestDto = {
    branch: string;
    account: string;
};

export type CreateAccountResponseDto = {
    id: string;
    branch: string;
    account: string;
};

export class CreateAccountExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createAccountService: CreateAccountUseCase
    ) { }

    static create() {
        const prisma = new PrismaClient();
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const peopleRepository = PeopleRepositoryPrisma.create(prisma);
        const createAccountService = CreateAccountUseCase.create(accountsRepository, peopleRepository);

        return new CreateAccountExpressRoute("/people/accounts", HttpMethod.POST, createAccountService);
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const { branch, account } = request.body;
            const document = (request as any).document;

            try {
                const output: CreateAccountResponseDto = await this.createAccountService.execute({
                    branch,
                    account,
                    document,
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

    private present(input: CreateAccountResponseDto): CreateAccountResponseDto {
        return {
            id: input.id,
            branch: input.branch,
            account: input.account,
        };
    }
}
