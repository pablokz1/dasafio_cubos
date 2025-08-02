import type { Accounts } from "../entity/accounts.entity";

export interface AccountsGateway {
    save(account: Accounts): Promise<void>;

    list(): Promise<Accounts[]>;

    findById(id: string): Promise<Accounts | null>;

    findByAccount(accountId: string): Promise<Accounts | null>

    findBalanceByAccountId(accountId: string): Promise<number | null>;
}