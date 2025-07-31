import type { Accounts } from "../entity/accounts.entity.js";

export interface AccountsGateway {
    save(account: Accounts): Promise<void>;

    list(): Promise<Accounts[]>;

    findById(id: string): Promise<Accounts | null>;

    findBalanceByAccountId(accountId: string): Promise<number | null>;
}