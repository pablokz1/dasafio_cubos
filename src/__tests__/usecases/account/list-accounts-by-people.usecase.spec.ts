import { Accounts } from "../../../domain/accounts/entity/accounts.entity";
import { ListAccountsByPeopleUseCase } from "../../../usecases/account/list-account-bypeople.usecase";

describe('ListAccountsByPeopleUseCase', () => {
    const mockAccountsGateway = {
        listByPersonId: jest.fn()
    };

    it('should return a list of accounts for a person', async () => {
        const mockAccounts = [
            Accounts.with({
                id: 'acc-1',
                branch: '001',
                account: '1234567-0',
                idPeople: 'person-1',
                balance: 100,
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            }),
            Accounts.with({
                id: 'acc-2',
                branch: '002',
                account: '7654321-1',
                idPeople: 'person-1',
                balance: 200,
                isActive: true,
                createdAt: new Date('2024-02-01'),
                updatedAt: new Date('2024-02-02'),
            }),
        ];

        mockAccountsGateway.listByPersonId.mockResolvedValue(mockAccounts);

        const usecase = ListAccountsByPeopleUseCase.create(mockAccountsGateway as any);
        const result = await usecase.execute({ idPeople: 'person-1' });

        expect(result.accounts).toHaveLength(2);
        expect(result.accounts[0]).toEqual({
            id: 'acc-1',
            branch: '001',
            account: '1234567-0',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
        });
    });
});
