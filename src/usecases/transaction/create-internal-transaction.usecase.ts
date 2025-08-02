import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";
import { Transactions } from "../../domain/transactions/entity/transactions.entity";
import { TransactionsGateway } from "../../domain/transactions/gateway/transactions.gateway";
import { Usecase } from "../usecase";

export type CreateInternalTransactionInputDto = {
    senderAccountId: string;
    receiverAccountId: string;
    value: number;
    description: string;
};

export type CreateInternalTransactionOutputDto = {
    id: string;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateInternalTransactionUseCase implements Usecase<CreateInternalTransactionInputDto, CreateInternalTransactionOutputDto> {
    constructor(
        private readonly transactionsGateway: TransactionsGateway,
        private readonly accountsGateway: AccountsGateway,
    ) { }

    public static create(
        transactionsGateway: TransactionsGateway,
        accountsGateway: AccountsGateway
    ) {
        return new CreateInternalTransactionUseCase(transactionsGateway, accountsGateway);
    }

    async execute(input: CreateInternalTransactionInputDto): Promise<CreateInternalTransactionOutputDto> {
        const { senderAccountId, receiverAccountId, value, description } = input;

        if (value < 0) {
            const senderBalance = await this.transactionsGateway.getBalance(senderAccountId);
            if (senderBalance + value < 0) {
                throw new Error("Insufficient balance.");
            }
        }

        const aInternalTransaction = Transactions.create(receiverAccountId, value, description);
        await this.transactionsGateway.save(aInternalTransaction);
        return this.presentOutput(aInternalTransaction);
    }

    private presentOutput(transaction: Transactions): CreateInternalTransactionOutputDto {
        return {
            id: transaction.id,
            description: transaction.description,
            value: transaction.value,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
}

