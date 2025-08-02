import type { Transactions } from "../entity/transactions.entity";

export interface TransactionsGateway {
    save(Transacrions: Transactions): Promise<void>;
    getBalance(accountId: string): Promise<number>;
    listByAccountId(
        accountId: string,
        itemsPerPage: number,
        currentPage: number,
        type?: "credit" | "debit"
    ): Promise<Transactions[]>;
}