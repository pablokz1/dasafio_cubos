import { GetBalanceUseCase } from '../../../usecases/account/get-balance.usecase';
import { AccountsGateway } from '../../../domain/accounts/gateway/acconts.gateway';

describe('GetBalanceUseCase', () => {
  let mockAccountsGateway: jest.Mocked<AccountsGateway>;

  beforeEach(() => {
    mockAccountsGateway = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<AccountsGateway>;
  });

  it('should return the balance of an existing account', async () => {
    const mockAccount = {
      id: 'account-123',
      branch: '001',
      account: '1234567-8',
      personId: 'person-123',
      balance: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAccountsGateway.findById.mockResolvedValue(mockAccount);

    const usecase = new GetBalanceUseCase(mockAccountsGateway);

    const result = await usecase.execute({ accountId: 'account-123' });

    expect(result).toEqual({ balance: 1000 });
    expect(mockAccountsGateway.findById).toHaveBeenCalledWith('account-123');
    expect(mockAccountsGateway.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the account is not found', async () => {
    mockAccountsGateway.findById.mockResolvedValue(null);

    const usecase = new GetBalanceUseCase(mockAccountsGateway);

    await expect(
      usecase.execute({ accountId: 'nonexistent-id' })
    ).rejects.toThrow('Conta não encontrada.');

    expect(mockAccountsGateway.findById).toHaveBeenCalledWith('nonexistent-id');
  });
});
