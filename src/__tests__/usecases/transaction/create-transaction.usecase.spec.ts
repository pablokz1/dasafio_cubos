import { CreateTransactionUseCase } from "../../../usecases/transaction/create-transaction.usecase";
import { TransactionsGateway } from "../../../domain/transactions/gateway/transactions.gateway";
import { AccountsGateway } from "../../../domain/accounts/gateway/acconts.gateway";
import { Transactions } from "../../../domain/transactions/entity/transactions.entity";

describe("CreateTransactionUseCase", () => {
    const mockTransactionsGateway: jest.Mocked<TransactionsGateway> = {
        save: jest.fn(),
        getBalance: jest.fn(),
        findById: jest.fn(),
        listByAccountId: jest.fn(),
        revertTransaction: jest.fn(),
    };

    const mockAccountsGateway: jest.Mocked<AccountsGateway> = {
        save: jest.fn(),
        listByPersonId: jest.fn(),
        findById: jest.fn(),
    };

    const useCase = CreateTransactionUseCase.create(mockTransactionsGateway, mockAccountsGateway);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a credit transaction successfully", async () => {
        const input = {
            accountId: "acc-1",
            value: 100,
            description: "Deposit",
        };

        const createdTransaction = Transactions.create(input.accountId, input.value, input.description);
        jest.spyOn(Transactions, "create").mockReturnValue(createdTransaction);

        const result = await useCase.execute(input);

        expect(mockTransactionsGateway.save).toHaveBeenCalledWith(createdTransaction);
        expect(result).toEqual({
            id: createdTransaction.id,
            value: createdTransaction.value,
            description: createdTransaction.description,
            createdAt: createdTransaction.createdAt,
            updatedAt: createdTransaction.updatedAt,
        });
    });

    it("should throw error when trying to create a debit transaction with insufficient balance", async () => {
        const input = {
            accountId: "acc-1",
            value: -200,
            description: "Withdrawal",
        };

        mockTransactionsGateway.getBalance.mockResolvedValue(100);

        await expect(useCase.execute(input)).rejects.toThrow("Insufficient balance.");
        expect(mockTransactionsGateway.getBalance).toHaveBeenCalledWith("acc-1");
        expect(mockTransactionsGateway.save).not.toHaveBeenCalled();
    });

    it("should create a debit transaction successfully if balance is sufficient", async () => {
        const input = {
            accountId: "acc-1",
            value: -50,
            description: "Bill payment",
        };

        mockTransactionsGateway.getBalance.mockResolvedValue(100);

        const createdTransaction = Transactions.create(input.accountId, input.value, input.description);
        jest.spyOn(Transactions, "create").mockReturnValue(createdTransaction);

        const result = await useCase.execute(input);

        expect(mockTransactionsGateway.getBalance).toHaveBeenCalledWith("acc-1");
        expect(mockTransactionsGateway.save).toHaveBeenCalledWith(createdTransaction);
        expect(result.id).toBe(createdTransaction.id);
    });
});
