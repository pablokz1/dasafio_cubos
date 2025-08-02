import type { Transactions } from "../entity/transactions.entity";

export interface TransactionsGateway {
    save(Transacrions: Transactions): Promise<void>;
    getBalance(accountId: string): Promise<number>;
    findById(transactionId: string): Promise<Transactions | null>;
    // revertTransaction(original: Transactions): Promise<Transactions>;
    findReversal(originalTransactionId: string): Promise<Transactions | null>;
    listByAccountId(
        accountId: string,
        itemsPerPage: number,
        currentPage: number,
        type?: "credit" | "debit"
    ): Promise<Transactions[]>;
}