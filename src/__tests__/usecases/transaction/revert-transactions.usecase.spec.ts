import { RevertTransactionUseCase } from "../../../usecases/transaction/revert-transaction.usecase";
import { TransactionsGateway } from "../../../domain/transactions/gateway/transactions.gateway";
import { Transactions } from "../../../domain/transactions/entity/transactions.entity";

describe("RevertTransactionUseCase", () => {
    let mockTransactionsGateway: jest.Mocked<TransactionsGateway>;
    let useCase: RevertTransactionUseCase;

    beforeEach(() => {
        mockTransactionsGateway = {
            findById: jest.fn(),
            findReversal: jest.fn(),
            getBalance: jest.fn(),
            save: jest.fn(),
            listByAccountId: jest.fn(),
            revertTransaction: jest.fn(),
        };

        useCase = RevertTransactionUseCase.create(mockTransactionsGateway);
        jest.clearAllMocks();
    });

    it("should throw if transaction not found", async () => {
        mockTransactionsGateway.findById.mockResolvedValue(undefined);

        await expect(
            useCase.execute({ accountId: "acc-1", transactionId: "txn-1" })
        ).rejects.toThrow("Transaction not found.");

        expect(mockTransactionsGateway.findById).toHaveBeenCalledWith("txn-1");
    });

    it("should throw if transaction does not belong to account", async () => {
        mockTransactionsGateway.findById.mockResolvedValue({
            id: "txn-1",
            accountId: "acc-2",
            value: 100,
            description: "Deposit",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Transactions);

        await expect(
            useCase.execute({ accountId: "acc-1", transactionId: "txn-1" })
        ).rejects.toThrow("Transaction does not belong to the specified account.");
    });

    it("should throw if transaction already reverted", async () => {
        const txn = {
            id: "txn-1",
            accountId: "acc-1",
            value: 100,
            description: "Deposit",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Transactions;

        mockTransactionsGateway.findById.mockResolvedValue(txn);
        mockTransactionsGateway.findReversal.mockResolvedValue({} as Transactions);

        await expect(
            useCase.execute({ accountId: "acc-1", transactionId: "txn-1" })
        ).rejects.toThrow("Transaction has already been reverted.");
    });

    it("should throw if insufficient balance to revert debit transaction", async () => {
        const debitTxn = {
            id: "txn-2",
            accountId: "acc-1",
            value: -100,
            description: "Withdrawal",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Transactions;

        mockTransactionsGateway.findById.mockResolvedValue(debitTxn);
        mockTransactionsGateway.findReversal.mockResolvedValue(undefined);
        mockTransactionsGateway.getBalance.mockResolvedValue(50);

        await expect(
            useCase.execute({ accountId: "acc-1", transactionId: "txn-2" })
        ).rejects.toThrow("Insufficient balance to revert the transaction.");
    });

    it("should revert transaction successfully", async () => {
        const originalTxn = {
            id: "txn-3",
            accountId: "acc-1",
            value: 100,
            description: "Deposit",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Transactions;

        const reversalTxn = {
            id: "rev-1",
            accountId: "acc-1",
            value: -100,
            description: `Reversal of txn-3`,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Transactions;

        mockTransactionsGateway.findById.mockResolvedValue(originalTxn);
        mockTransactionsGateway.findReversal.mockResolvedValue(undefined);
        mockTransactionsGateway.getBalance.mockResolvedValue(200);

        jest.spyOn(Transactions, "reverse").mockReturnValue(reversalTxn);

        const result = await useCase.execute({ accountId: "acc-1", transactionId: "txn-3" });

        expect(mockTransactionsGateway.save).toHaveBeenCalledWith(reversalTxn);
        expect(result).toEqual({
            id: reversalTxn.id,
            value: reversalTxn.value,
            description: reversalTxn.description,
            createdAt: reversalTxn.createdAt,
            updatedAt: reversalTxn.updatedAt,
        });
    });
});
