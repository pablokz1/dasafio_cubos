import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { PrismaClient } from "@prisma/client";
import { CardsRepositoryPrisma } from "../../../../infra/repository/cards/cards.repository.prisma";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ListCardsByPeopleUseCase, ListCardsByPersonOutputDto } from "../../../../usecases/cards/list-cards-beypeople.usecase";

type ListCardsByPeopleResponseDTO = {
    cards: {
        id: string;
        type: string;
        number: string;
        cvv: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    pagination: {
        itemsPerPage: number;
        currentPage: number;
    };
};

export class ListCardsByPeopleExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listCardsUseCase: ListCardsByPeopleUseCase
    ) { }

    static create() {
        const prisma = new PrismaClient();
        const cardsRepository = new CardsRepositoryPrisma(prisma);
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const usecase = new ListCardsByPeopleUseCase(cardsRepository, accountsRepository);
        return new ListCardsByPeopleExpressRoute("/people/cards", HttpMethod.GET, usecase);
    }

    public getHandler() {
        return async (req: Request, res: Response): Promise<void> => {
            const personId = (req as any).idPeople as string;
            const itemsPerPage = Number(req.query.itemsPerPage) || 10;
            const currentPage = Number(req.query.currentPage) || 1;

            try {
                const output = await this.listCardsUseCase.execute({
                    personId,
                    itemsPerPage,
                    currentPage,
                });

                const response = this.present(output);
                res.status(200).json(response);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ message: error.message });
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

    private present(input: ListCardsByPersonOutputDto): ListCardsByPeopleResponseDTO {
        return {
            cards: input.cards.map(card => ({
                id: card.id,
                type: card.type as 'physical' | 'virtual',
                number: card.number,
                cvv: card.cvv,
                createdAt: card.createdAt,
                updatedAt: card.updatedAt,
            })),
            pagination: {
                ...input.pagination,
            },
        };
    }

}
