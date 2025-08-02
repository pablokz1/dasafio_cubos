import { CreateInternalTransactionUseCase } from "../../../usecases/transaction/create-internal-transaction.usecase";
import { TransactionsGateway } from "../../../domain/transactions/gateway/transactions.gateway";
import { AccountsGateway } from "../../../domain/accounts/gateway/acconts.gateway";
import { Transactions } from "../../../domain/transactions/entity/transactions.entity";

describe("CreateInternalTransactionUseCase", () => {
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

    const useCase = CreateInternalTransactionUseCase.create(
        mockTransactionsGateway,
        mockAccountsGateway
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create internal transaction successfully", async () => {
        const input = {
            senderAccountId: "acc-1",
            receiverAccountId: "acc-2",
            value: 100,
            description: "Transferência interna",
        };

        const createdTransaction = Transactions.create(
            input.receiverAccountId,
            input.value,
            input.description
        );

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

    it("should throw error if balance is insufficient for negative value", async () => {
        const input = {
            senderAccountId: "acc-1",
            receiverAccountId: "acc-2",
            value: -100,
            description: "Estorno/Retirada",
        };

        mockTransactionsGateway.getBalance.mockResolvedValue(50);

        await expect(useCase.execute(input)).rejects.toThrow("Insufficient balance.");

        expect(mockTransactionsGateway.getBalance).toHaveBeenCalledWith("acc-1");
        expect(mockTransactionsGateway.save).not.toHaveBeenCalled();
    });

    it("should allow negative transaction if balance is enough", async () => {
        const input = {
            senderAccountId: "acc-1",
            receiverAccountId: "acc-2",
            value: -50,
            description: "Estorno",
        };

        mockTransactionsGateway.getBalance.mockResolvedValue(100);

        const createdTransaction = Transactions.create(
            input.receiverAccountId,
            input.value,
            input.description
        );

        jest.spyOn(Transactions, "create").mockReturnValue(createdTransaction);

        const result = await useCase.execute(input);

        expect(mockTransactionsGateway.getBalance).toHaveBeenCalledWith("acc-1");
        expect(mockTransactionsGateway.save).toHaveBeenCalledWith(createdTransaction);
        expect(result.id).toBe(createdTransaction.id);
    });
});
