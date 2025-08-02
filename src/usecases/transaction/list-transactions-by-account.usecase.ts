import { TransactionsGateway } from "../../domain/transactions/gateway/transactions.gateway";
import { Usecase } from "../usecase";

export type ListTransactionsInputDto = {
    accountId: string;
    itemsPerPage: number;
    currentPage: number;
    type?: "credit" | "debit" | undefined;
};

export type ListTransactionsOutputDto = {
    transactions: {
        id: string;
        value: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    pagination: {
        itemsPerPage: number;
        currentPage: number;
    };
};

export class ListTransactionsByAccountUseCase implements Usecase<ListTransactionsInputDto, ListTransactionsOutputDto> {
    constructor(private readonly transactionsGateway: TransactionsGateway) { }

    public static create(transactionsGateway: TransactionsGateway) {
        return new ListTransactionsByAccountUseCase(transactionsGateway);
    }

    async execute(input: ListTransactionsInputDto): Promise<ListTransactionsOutputDto> {
        const { accountId, itemsPerPage, currentPage, type } = input;
        const offset = (currentPage - 1) * itemsPerPage;

        const allTransactions = await this.transactionsGateway.listByAccountId(
            accountId,
            itemsPerPage,
            currentPage,
            type
        );

        return {
            transactions: allTransactions.map((t) => ({
                id: t.id,
                value: t.value,
                description: t.description,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
            })),
            pagination: { itemsPerPage, currentPage },
        };
    }
}
