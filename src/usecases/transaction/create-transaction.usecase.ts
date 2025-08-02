import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";
import { Transactions } from "../../domain/transactions/entity/transactions.entity";
import { TransactionsGateway } from "../../domain/transactions/gateway/transactions.gateway";
import { Usecase } from "../usecase";

export type CreateTransactionInputDto = {
    accountId: string;
    value: number;
    description: string;
};

export type CreateTransactionOutputDto = {
    id: string;
    value: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateTransactionUseCase implements Usecase<CreateTransactionInputDto, CreateTransactionOutputDto> {
    constructor(
        private readonly transactionsGateway: TransactionsGateway,
        private readonly accountsGateway: AccountsGateway
    ) { }

    public static create(
        transactionsGateway: TransactionsGateway,
         accountsGateway: AccountsGateway
    ) {
        return new CreateTransactionUseCase(transactionsGateway, accountsGateway);
    }
    async execute(input: CreateTransactionInputDto): Promise<CreateTransactionOutputDto> {
        const { accountId, value, description } = input;

        if (value < 0) {
            const balance = await this.transactionsGateway.getBalance(accountId);
            if (balance + value < 0) {
                throw new Error("Insufficient balance.");
            }
        }

        const aTransaction = Transactions.create(accountId, value, description);
        await this.transactionsGateway.save(aTransaction);
        return this.presentOutput(aTransaction);
    }

    private presentOutput(transaction: Transactions): CreateTransactionOutputDto {
        return {
            id: transaction.id,
            description: transaction.description,
            value: transaction.value,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }


}
