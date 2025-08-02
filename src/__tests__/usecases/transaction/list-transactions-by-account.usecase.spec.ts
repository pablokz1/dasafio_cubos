import { ListTransactionsByAccountUseCase } from "../../../usecases/transaction/list-transactions-by-account.usecase";
import { TransactionsGateway } from "../../../domain/transactions/gateway/transactions.gateway";

describe("ListTransactionsByAccountUseCase", () => {
    const mockTransactionsGateway: jest.Mocked<TransactionsGateway> = {
        listByAccountId: jest.fn(),
        save: jest.fn(),
        getBalance: jest.fn(),
        findById: jest.fn(),
        revertTransaction: jest.fn(),
    };

    const useCase = ListTransactionsByAccountUseCase.create(mockTransactionsGateway);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should list transactions with pagination and no filter", async () => {
        const now = new Date();

        mockTransactionsGateway.listByAccountId.mockResolvedValue([
            {
                id: "txn-1",
                accountId: "acc-1",
                value: 100,
                description: "Deposit",
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "txn-2",
                accountId: "acc-1",
                value: -50,
                description: "Withdrawal",
                createdAt: now,
                updatedAt: now,
            },
        ] as any);

        const input = {
            accountId: "acc-1",
            itemsPerPage: 10,
            currentPage: 1,
            type: undefined,
        };

        const result = await useCase.execute(input);

        expect(mockTransactionsGateway.listByAccountId).toHaveBeenCalledWith(
            "acc-1",
            10,
            1,
            undefined
        );

        expect(result.transactions).toHaveLength(2);
        expect(result.pagination).toEqual({ itemsPerPage: 10, currentPage: 1 });
    });

    it("should list transactions filtered by type", async () => {
        const now = new Date();

        mockTransactionsGateway.listByAccountId.mockResolvedValue([
            {
                id: "txn-3",
                accountId: "acc-2",
                value: 200,
                description: "Deposit",
                createdAt: now,
                updatedAt: now,
            },
        ] as any);

        const input = {
            accountId: "acc-2",
            itemsPerPage: 5,
            currentPage: 2,
            type: "credit",
        };

        const result = await useCase.execute(input);

        expect(mockTransactionsGateway.listByAccountId).toHaveBeenCalledWith(
            "acc-2",
            5,
            2,
            "credit"
        );

        expect(result.transactions).toHaveLength(1);
        expect(result.pagination).toEqual({ itemsPerPage: 5, currentPage: 2 });
    });

    it("should return empty list if no transactions", async () => {
        mockTransactionsGateway.listByAccountId.mockResolvedValue([]);

        const input = {
            accountId: "acc-3",
            itemsPerPage: 10,
            currentPage: 1,
            type: undefined,
        };

        const result = await useCase.execute(input);

        expect(result.transactions).toEqual([]);
        expect(result.pagination).toEqual({ itemsPerPage: 10, currentPage: 1 });
    });
});
