import { Accounts, AccountsProps } from "../../../../domain/accounts/entity/accounts.entity";

describe("Accounts Entity", () => {
    const fixedDate = new Date("2025-01-01T12:00:00Z");
    const mockUuid = "123e4567-e89b-12d3-a456-426614174000";

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(fixedDate);

        global.crypto = {
            randomUUID: () => mockUuid,
        } as any;
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe("create()", () => {
        it("should create an Accounts instance with correct default values", () => {
            const account = Accounts.create("001", "1234567-0", "person-1");

            expect(account.id).toBe(mockUuid);
            expect(account.branch).toBe("001");
            expect(account.account).toBe("1234567-0");
            expect(account.idPeople).toBe("person-1");
            expect(account.balance).toBe(0);
            expect(account.isActive).toBe(true);
            expect(account.createdAt).toEqual(fixedDate);
            expect(account.updatedAt).toEqual(fixedDate);
        });
    });

    describe("with()", () => {
        it("should create an Accounts instance from props", () => {
            const props: AccountsProps = {
                id: mockUuid,
                idPeople: "person-2",
                branch: "002",
                account: "7654321-9",
                balance: 500,
                isActive: false,
                createdAt: new Date("2024-12-01T10:00:00Z"),
                updatedAt: new Date("2024-12-05T15:00:00Z"),
            };

            const account = Accounts.with(props);

            expect(account.id).toBe(props.id);
            expect(account.branch).toBe(props.branch);
            expect(account.account).toBe(props.account);
            expect(account.idPeople).toBe(props.idPeople);
            expect(account.balance).toBe(props.balance);
            expect(account.isActive).toBe(props.isActive);
            expect(account.createdAt).toEqual(props.createdAt);
            expect(account.updatedAt).toEqual(props.updatedAt);
        });
    });

    describe("getters", () => {
        it("should return the correct property values", () => {
            const props: AccountsProps = {
                id: mockUuid,
                idPeople: "person-3",
                branch: "003",
                account: "1112223-4",
                balance: 1000,
                isActive: true,
                createdAt: new Date("2023-05-10T08:00:00Z"),
                updatedAt: new Date("2023-06-11T09:00:00Z"),
            };

            const account = Accounts.with(props);

            expect(account.branch).toBe("003");
            expect(account.account).toBe("1112223-4");
            expect(account.idPeople).toBe("person-3");
            expect(account.balance).toBe(1000);
            expect(account.isActive).toBe(true);
        });
    });
});
