import type { Transactions } from "../entity/transactions.entity.js";

export interface TransactionsGateway {
    save(Transacrions: Transactions): Promise<void>;

    saveInternalTransactions(Transacrions: Transactions): Promise<void>;

    list(): Promise<Transactions[]>;

    findeByAccountId(accountId: string): Promise<Transactions | null>;
}