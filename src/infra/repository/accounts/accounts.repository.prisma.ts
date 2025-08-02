import { PrismaClient } from "@prisma/client";
import { AccountsGateway } from "../../../domain/accounts/gateway/acconts.gateway";
import { Accounts } from "../../../domain/accounts/entity/accounts.entity";

export class AccountsRepositoryPrisma implements AccountsGateway {
    constructor(private readonly prisma: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new AccountsRepositoryPrisma(prismaClient);
    }

    async save(account: Accounts): Promise<void> {
        await this.prisma.account.create({
            data: {
                id: account.id,
                branch: account.branch,
                account: account.account,
                idPeople: account.idPeople,
                balance: account.balance,
                isActive: account.isActive,
            },
        });
    }

    async list(): Promise<Accounts[]> {
        const accounts = await this.prisma.account.findMany();
        return accounts.map(
            (account) =>
                Accounts.with({
                    id: account.id,
                    branch: account.branch,
                    account: account.account,
                    idPeople: account.idPeople,
                    balance: account.balance.toNumber(),
                    isActive: account.isActive,
                    createdAt: account.createdAt,
                    updatedAt: account.updatedAt
                })
        );
    }

    async listByPersonId(idPeople: string): Promise<Accounts[]> {
        const accountsData = await this.prisma.account.findMany({
            where: { idPeople },
        });

        return accountsData.map((a) =>
            Accounts.with({
                id: a.id,
                idPeople: a.idPeople,
                branch: a.branch,
                account: a.account,
                balance: Number(a.balance),
                isActive: a.isActive,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
            })
        );
    }

    async findById(id: string): Promise<Accounts | null> {
        const account = await this.prisma.account.findUnique({
            where: {
                id,
            },
        });
        if (!account) {
            return null;
        }
        return Accounts.with({
            id: account.id,
            branch: account.branch,
            account: account.account,
            idPeople: account.idPeople,
            balance: account.balance.toNumber(),
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        });
    }

    async findBalanceByAccountId(accountId: string): Promise<number | null> {
        const account = await this.prisma.account.findUnique({
            where: { id: accountId },
            select: { balance: true },
        });

        if (!account) return null;

        return account.balance.toNumber();
    }


    async findByAccount(accountNumber: string): Promise<Accounts | null> {
        const account = await this.prisma.account.findUnique({
            where: {
                account: accountNumber,
            },
        });
        if (!account) {
            return null;
        }
        return Accounts.with({
            id: account.id,
            branch: account.branch,
            account: account.account,
            idPeople: account.idPeople,
            balance: account.balance.toNumber(),
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        });
    }
}
