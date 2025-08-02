import type { Accounts } from "../../../../domain/accounts/entity/accounts.entity";
import type { AccountsGateway } from "../../../../domain/accounts/gateway/acconts.gateway";

describe("AccountsGateway Mock", () => {
    let mockAccountsGateway: jest.Mocked<AccountsGateway>;
    let sampleAccount: Accounts;

    beforeEach(() => {
        sampleAccount = {
            id: "acc-1",
            idPeople: "person-1",
            branch: "001",
            account: "1234567-0",
            balance: 1000,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Accounts;

        mockAccountsGateway = {
            save: jest.fn().mockResolvedValue(undefined),
            list: jest.fn().mockResolvedValue([sampleAccount]),
            findById: jest.fn().mockResolvedValue(sampleAccount),
            findByAccount: jest.fn().mockResolvedValue(sampleAccount),
            findBalanceByAccountId: jest.fn().mockResolvedValue(1000),
            listByPersonId: jest.fn().mockResolvedValue([sampleAccount]),
        };
    });

    it("should call save with the account", async () => {
        await mockAccountsGateway.save(sampleAccount);
        expect(mockAccountsGateway.save).toHaveBeenCalledWith(sampleAccount);
    });

    it("should return a list of accounts", async () => {
        const accounts = await mockAccountsGateway.list();
        expect(accounts).toHaveLength(1);
        expect(accounts[0]).toEqual(sampleAccount);
    });

    it("should find account by id", async () => {
        const account = await mockAccountsGateway.findById("acc-1");
        expect(account).toEqual(sampleAccount);
    });

    it("should find account by account number", async () => {
        const account = await mockAccountsGateway.findByAccount("1234567-0");
        expect(account).toEqual(sampleAccount);
    });

    it("should get balance by account id", async () => {
        const balance = await mockAccountsGateway.findBalanceByAccountId("acc-1");
        expect(balance).toBe(1000);
    });

    it("should list accounts by person id", async () => {
        const accounts = await mockAccountsGateway.listByPersonId("person-1");
        expect(accounts).toHaveLength(1);
        expect(accounts[0]).toEqual(sampleAccount);
    });
});
