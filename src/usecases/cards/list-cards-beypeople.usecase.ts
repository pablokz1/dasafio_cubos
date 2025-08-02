import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";
import { CardsGateway } from "../../domain/cards/gateway/cards.gateway";
import { Usecase } from "../usecase";

export type ListCardDto = {
    id: string;
    type: 'physical' | 'virtual';
    number: string;
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
};


export type ListCardsByPersonInputDto = {
    personId: string;
    itemsPerPage?: number;
    currentPage?: number;
};

export type ListCardsByPersonOutputDto = {
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

export class ListCardsByPersonUseCase implements Usecase<ListCardsByPersonInputDto, ListCardsByPersonOutputDto> {
    constructor(
        private readonly cardsGateway: CardsGateway,
        private readonly accountsGateway: AccountsGateway
    ) { }

    public static create(cardsGateway: CardsGateway, accountsGateway: AccountsGateway) {
        return new ListCardsByPersonUseCase(cardsGateway, accountsGateway);
    }

    async execute(input: ListCardsByPersonInputDto): Promise<ListCardsByPersonOutputDto> {
        const itemsPerPage = input.itemsPerPage ?? 10;
        const currentPage = input.currentPage ?? 1;

        const accounts = await this.accountsGateway.listByPersonId(input.personId);
        const accountIds = accounts.map(a => a.id);

        const allCards = await this.cardsGateway.listByAccountIds(accountIds, itemsPerPage, currentPage);

        const cards: ListCardDto[] = allCards.map(c => ({
            id: c.id,
            type: c.type,
            number: c.number.slice(-4),
            cvv: c.cvv,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }));

        return {
            cards,
            pagination: {
                itemsPerPage,
                currentPage,
            },
        };
    }
}
