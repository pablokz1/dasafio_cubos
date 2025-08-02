import { PrismaClient } from "@prisma/client";
import { TransactionsGateway } from "../../../domain/transactions/gateway/transactions.gateway";
import { Transactions } from "../../../domain/transactions/entity/transactions.entity";
import Decimal from "decimal.js";

export class TransactionRepositoryPrisma implements TransactionsGateway {
    constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new TransactionRepositoryPrisma(prismaClient);
    }

    public async save(transaction: Transactions): Promise<void> {
        await this.prismaClient.transaction.create({
            data: {
                id: transaction.id,
                value: transaction.value,
                description: transaction.description,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
                account: {
                    connect: { id: transaction.accountId },
                },
            },
        });

        const account = await this.prismaClient.account.findUniqueOrThrow({
            where: { id: transaction.accountId },
        });

        const currentBalance = new Decimal(account.balance);
        const transactionValue = new Decimal(transaction.value);

        const newBalance = currentBalance.plus(transactionValue);

        await this.prismaClient.account.update({
            where: { id: transaction.accountId },
            data: { balance: newBalance },
        });
    }

    public async getBalance(accountId: string): Promise<number> {
        const result = await this.prismaClient.transaction.aggregate({
            where: { idAccount: accountId },
            _sum: { value: true },
        });

        return result._sum.value?.toNumber() ?? 0;
    }

    public async listByAccountId(
        accountId: string,
        itemsPerPage: number,
        currentPage: number,
        type?: "credit" | "debit"
    ): Promise<Transactions[]> {
        const where: any = {
            idAccount: accountId,
        };

        if (type === "credit") {
            where.value = { gte: 0 };
        } else if (type === "debit") {
            where.value = { lt: 0 };
        }

        const skip = (currentPage - 1) * itemsPerPage;

        const results = await this.prismaClient.transaction.findMany({
            where,
            skip,
            take: itemsPerPage,
            orderBy: { createdAt: "desc" },
        });

        return results.map((row) =>
            Transactions.with({
                id: row.id,
                value: row.value.toNumber(),
                description: row.description,
                accountId: row.idAccount,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
            })
        );
    }

}
