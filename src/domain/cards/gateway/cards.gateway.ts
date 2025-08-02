import { Card } from "../entity/cards.entity";

export interface CardsGateway {
    save(card: Card): Promise<void>;
    listByAccountId(accountId: string): Promise<Card[]>;
    findPhysicalCardByAccountId(accountId: string): Promise<Card | null>;
}
