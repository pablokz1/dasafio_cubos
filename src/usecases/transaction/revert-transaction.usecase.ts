import { Usecase } from "../usecase";
import { TransactionsGateway } from "../../domain/transactions/gateway/transactions.gateway";
import { Transactions } from "../../domain/transactions/entity/transactions.entity";

export type RevertTransactionInputDto = {
    accountId: string;
    transactionId: string;
};

export type RevertTransactionOutputDto = {
    id: string;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export class RevertTransactionUseCase implements Usecase<RevertTransactionInputDto, RevertTransactionOutputDto> {
    constructor(private readonly transactionsGateway: TransactionsGateway) { }

    public static create(transactionsGateway: TransactionsGateway) {
        return new RevertTransactionUseCase(transactionsGateway);
    }

    async execute(input: RevertTransactionInputDto): Promise<RevertTransactionOutputDto> {
        const transaction = await this.transactionsGateway.findById(input.transactionId);

        if (!transaction) {
            throw new Error("Transaction not found.");
        }

        if (transaction.accountId !== input.accountId) {
            throw new Error("Transaction does not belong to the specified account.");
        }

        const alreadyReverted = await this.transactionsGateway.findReversal(input.transactionId);
        if (alreadyReverted) {
            throw new Error("Transaction has already been reverted.");
        }

        const balance = await this.transactionsGateway.getBalance(input.accountId);

        const isOriginalCredit = transaction.value > 0;
        const reversalValue = -transaction.value;

        if (!isOriginalCredit && balance < Math.abs(reversalValue)) {
            throw new Error("Insufficient balance to revert the transaction.");
        }

        const reversal = Transactions.reverse(transaction, transaction.accountId);
        await this.transactionsGateway.save(reversal);
        return this.presentOutput(reversal);
    }


    private presentOutput(transaction: Transactions): RevertTransactionOutputDto {
        return {
            id: transaction.id,
            value: transaction.value,
            description: transaction.description,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
}
