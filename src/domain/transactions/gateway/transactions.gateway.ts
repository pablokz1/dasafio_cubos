import type { Transactions } from "../entity/transactions.entity";

export interface TransactionsGateway {
    save(Transacrions: Transactions): Promise<void>;

    getBalance(accountId: string): Promise<number>;

    // saveInternalTransactions(Transacrions: Transactions): Promise<void>;

    // list(): Promise<Transactions[]>;

    // findById(transactionId: string): Promise<Transactions | null>;

    // findeByAccountId(accountId: string): Promise<Transactions | null>;
}