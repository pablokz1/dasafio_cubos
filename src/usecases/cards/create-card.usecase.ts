import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";
import { Card } from "../../domain/cards/entity/cards.entity";
import { CardsGateway } from "../../domain/cards/gateway/cards.gateway";
import { Usecase } from "../usecase";

export type CreateCardInputDto = {
    accountId: string;
    type: 'physical' | 'virtual';
    number: string;
    cvv: string;
};

export type CreateCardOutputDto = {
    id: string;
    type: 'physical' | 'virtual';
    number: string; // últimos 4 dígitos só
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateCardUseCase implements Usecase<CreateCardInputDto, CreateCardOutputDto> {
    constructor(
        private readonly cardsGateway: CardsGateway,
        private readonly accountsGateway: AccountsGateway,
    ) { }

    public static create(
        cardsGateway: CardsGateway,
        accountsGateway: AccountsGateway) {
        return new CreateCardUseCase(cardsGateway, accountsGateway);
    }

    async execute(input: CreateCardInputDto): Promise<CreateCardOutputDto> {
        const { accountId, type, number, cvv } = input;

        if (!/^\d{3}$/.test(cvv)) {
            throw new Error("CVV must have exactly 3 digits.");
        }

        if (type !== 'physical' && type !== 'virtual') {
            throw new Error("Card type must be 'physical' or 'virtual'.");
        }

        const account = await this.accountsGateway.findById(accountId);
        if (!account) {
            throw new Error("Account not found.");
        }

        if (type === 'physical') {
            const physicalCard = await this.cardsGateway.findPhysicalCardByAccountId(accountId);
            if (physicalCard) {
                throw new Error("Only one physical card allowed per account.");
            }
        }

        const aCard = Card.create(accountId, type, number.replace(/\s+/g, ''), cvv);
        await this.cardsGateway.save(aCard);
        return this.presentOutput(aCard)
    }

    private presentOutput(card: Card): CreateCardOutputDto {
        return {
            id: card.id,
            type: card.type,
            number: card.number.slice(-4),
            cvv: card.cvv,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt,
        };
    }
}
