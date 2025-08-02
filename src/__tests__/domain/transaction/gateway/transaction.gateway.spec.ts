import type { Transactions } from "../../../../domain/transactions/entity/transactions.entity";
import type { TransactionsGateway } from "../../../../domain/transactions/gateway/transactions.gateway";

export function createMockTransactionsGateway(): jest.Mocked<TransactionsGateway> {
    return {
        save: jest.fn(),
        getBalance: jest.fn(),
        findById: jest.fn(),
        findReversal: jest.fn(),
        listByAccountId: jest.fn(),
    };
}

describe("TransactionsGateway (mock)", () => {
    let mockGateway: jest.Mocked<TransactionsGateway>;

    beforeEach(() => {
        mockGateway = createMockTransactionsGateway();
    });

    it("should call save with a Transactions entity", async () => {
        const fakeTransaction = {} as Transactions;
        await mockGateway.save(fakeTransaction);
        expect(mockGateway.save).toHaveBeenCalledWith(fakeTransaction);
    });

    it("should return a balance when getBalance is called", async () => {
        mockGateway.getBalance.mockResolvedValue(500);
        const balance = await mockGateway.getBalance("account-123");
        expect(balance).toBe(500);
        expect(mockGateway.getBalance).toHaveBeenCalledWith("account-123");
    });

    it("should return a transaction or null when findById is called", async () => {
        const fakeTransaction = {} as Transactions;
        mockGateway.findById.mockResolvedValue(fakeTransaction);
        let result = await mockGateway.findById("tx-1");
        expect(result).toBe(fakeTransaction);
        expect(mockGateway.findById).toHaveBeenCalledWith("tx-1");

        mockGateway.findById.mockResolvedValue(null);
        result = await mockGateway.findById("tx-2");
        expect(result).toBeNull();
    });

    it("should return a reversal transaction or null when findReversal is called", async () => {
        const fakeTransaction = {} as Transactions;
        mockGateway.findReversal.mockResolvedValue(fakeTransaction);
        let result = await mockGateway.findReversal("tx-1");
        expect(result).toBe(fakeTransaction);
        expect(mockGateway.findReversal).toHaveBeenCalledWith("tx-1");

        mockGateway.findReversal.mockResolvedValue(null);
        result = await mockGateway.findReversal("tx-2");
        expect(result).toBeNull();
    });

    it("should return a list of transactions when listByAccountId is called", async () => {
        const fakeTransactions = [{} as Transactions, {} as Transactions];
        mockGateway.listByAccountId.mockResolvedValue(fakeTransactions);
        const result = await mockGateway.listByAccountId("account-1", 10, 1, "credit");
        expect(result).toBe(fakeTransactions);
        expect(mockGateway.listByAccountId).toHaveBeenCalledWith("account-1", 10, 1, "credit");
    });
});
