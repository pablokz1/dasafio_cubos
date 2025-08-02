import { Transactions, TransactionsProps } from "../../../../domain/transactions/entity/transactions.entity";

describe("Transactions Entity", () => {
    const fixedDate = new Date("2025-01-01T12:00:00Z");
    const cryptoRandomUUIDSpy = jest.spyOn(global.crypto, "randomUUID").mockReturnValue("uuid-1234");

    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(fixedDate);
    });

    afterAll(() => {
        jest.useRealTimers();
        cryptoRandomUUIDSpy.mockRestore();
    });

    describe("create()", () => {
        it("should create a Transactions instance with correct default values", () => {
            const accountId = "acc-1";
            const value = 100;
            const description = "Deposit";

            const transaction = Transactions.create(accountId, value, description);

            expect(transaction).toBeInstanceOf(Transactions);
            expect(transaction.accountId).toBe(accountId);
            expect(transaction.value).toBe(value);
            expect(transaction.description).toBe(description);
            expect(transaction.revertedFromId).toBeNull();
            expect(transaction.createdAt).toEqual(fixedDate);
            expect(transaction.updatedAt).toEqual(fixedDate);
            expect(cryptoRandomUUIDSpy).toHaveBeenCalled();
        });
    });

    describe("internalTransaction()", () => {
        it("should create a Transactions instance for internal transactions", () => {
            const receiverAccountId = "acc-2";
            const senderAccountId = "acc-1";
            const value = 50;
            const description = "Transfer";

            const transaction = Transactions.internalTransaction(receiverAccountId, senderAccountId, value, description);

            expect(transaction).toBeInstanceOf(Transactions);
            expect(transaction.accountId).toBe(senderAccountId);
            expect(transaction.value).toBe(value);
            expect(transaction.description).toBe(description);
            expect(transaction.revertedFromId).toBeNull();
            expect(transaction.createdAt).toEqual(fixedDate);
            expect(transaction.updatedAt).toEqual(fixedDate);
        });
    });

    describe("reverse()", () => {
        it("should create a reversed Transactions instance", () => {
            const original = Transactions.create("acc-1", 100, "Payment");
            const reversedAccountId = "acc-1";

            const reversed = Transactions.reverse(original, reversedAccountId);

            expect(reversed).toBeInstanceOf(Transactions);
            expect(reversed.accountId).toBe(reversedAccountId);
            expect(reversed.value).toBe(-original.value);
            expect(reversed.description).toBe(`reversal: ${original.description}`);
            expect(reversed.revertedFromId).toBe(original.id);
            expect(reversed.createdAt).toEqual(fixedDate);
            expect(reversed.updatedAt).toEqual(fixedDate);
        });
    });

    describe("with()", () => {
        it("should create a Transactions instance from props", () => {
            const props: TransactionsProps = {
                id: "uuid-5678",
                accountId: "acc-3",
                value: 200,
                description: "Test",
                revertedFromId: null,
                createdAt: fixedDate,
                updatedAt: fixedDate,
            };

            const transaction = Transactions.with(props);

            expect(transaction).toBeInstanceOf(Transactions);
            expect(transaction.accountId).toBe(props.accountId);
            expect(transaction.value).toBe(props.value);
            expect(transaction.description).toBe(props.description);
            expect(transaction.revertedFromId).toBeNull();
            expect(transaction.createdAt).toEqual(fixedDate);
            expect(transaction.updatedAt).toEqual(fixedDate);
        });
    });

    describe("getters", () => {
        it("should return the correct property values", () => {
            const props: TransactionsProps = {
                id: "uuid-9999",
                accountId: "acc-9",
                value: 123,
                description: "Some desc",
                revertedFromId: "uuid-1111",
                createdAt: fixedDate,
                updatedAt: fixedDate,
            };

            const transaction = Transactions.with(props);

            expect(transaction.accountId).toBe(props.accountId);
            expect(transaction.value).toBe(props.value);
            expect(transaction.description).toBe(props.description);
            expect(transaction.revertedFromId).toBe(props.revertedFromId);
            expect(transaction.createdAt).toEqual(fixedDate);
            expect(transaction.updatedAt).toEqual(fixedDate);
        });
    });
});
