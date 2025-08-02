import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { PrismaClient } from "@prisma/client";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";
import { CardsRepositoryPrisma } from "../../../../infra/repository/cards/cards.repository.prisma";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { CreateCardUseCase } from "../../../../usecases/cards/create-card.usecase";

export type AddCardRequestDto = {
    type: "physical" | "virtual";
    number: string;
    cvv: string;
};

export type AddCardResponseDto = {
    id: string;
    type: "physical" | "virtual";
    number: string;
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateCardExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createCardService: CreateCardUseCase
    ) { }

    static create() {
        const prisma = new PrismaClient();
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const cardsRepository = new CardsRepositoryPrisma(prisma);
        const addCardService = CreateCardUseCase.create(cardsRepository, accountsRepository);

        return new CreateCardExpressRoute(
            "/people/accounts/:accountId/cards",
            HttpMethod.POST,
            addCardService
        );
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const accountId = request.params.accountId;

            if (!accountId) {
                response.status(400).json({ message: "Parâmetro 'accountId' é obrigatório." });
                return;
            }

            const { type, number, cvv } = request.body;

            try {
                const output = await this.createCardService.execute({
                    accountId,
                    type,
                    number,
                    cvv,
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

    private present(input: AddCardResponseDto): AddCardResponseDto {
        return {
            id: input.id,
            type: input.type,
            number: input.number,
            cvv: input.cvv,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        };
    }
}
