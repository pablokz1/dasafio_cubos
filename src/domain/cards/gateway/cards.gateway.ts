import type { Cards } from "../entity/cards.entity.js";

export interface CardsGateway {
    save(Cards: Cards): Promise<void>;

    list(): Promise<Cards[]>;

    findeByAccountId(accountId: string): Promise<Cards | null>;
}