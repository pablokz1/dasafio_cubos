import { CreateAccountUseCase } from '../../../usecases/account/create-account.usecase';
import { AccountsGateway } from '../../../domain/accounts/gateway/acconts.gateway';
import { PeopleGateway } from '../../../domain/people/gateway/people.gateway';
import { Accounts } from '../../../domain/accounts/entity/accounts.entity';

describe('CreateAccountUseCase', () => {
  let mockAccountsGateway: jest.Mocked<AccountsGateway>;
  let mockPeopleGateway: jest.Mocked<PeopleGateway>;

  beforeEach(() => {
    mockAccountsGateway = {
      findByAccount: jest.fn(),
      save: jest.fn()
    } as unknown as jest.Mocked<AccountsGateway>;

    mockPeopleGateway = {
      findByDocument: jest.fn()
    } as unknown as jest.Mocked<PeopleGateway>;
  });

  it('should create a new account successfully', async () => {
    const input = {
      branch: '123',
      account: '1234567-8',
      document: '12345678900'
    };

    mockAccountsGateway.findByAccount.mockResolvedValue(null);
    mockPeopleGateway.findByDocument.mockResolvedValue({
      id: 'person-id',
      name: 'Test Person',
      document: input.document,
      password: 'hash',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockAccountsGateway.save.mockImplementation(async () => Promise.resolve());

    const usecase = CreateAccountUseCase.create(mockAccountsGateway, mockPeopleGateway);
    const result = await usecase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.branch).toBe('123');
    expect(result.account).toBe('1234567-8');
    expect(mockAccountsGateway.findByAccount).toHaveBeenCalledWith('1234567-8');
    expect(mockPeopleGateway.findByDocument).toHaveBeenCalledWith('12345678900');
    expect(mockAccountsGateway.save).toHaveBeenCalled();
  });

  it('should throw error if branch is invalid', async () => {
    const input = {
      branch: '12',
      account: '1234567-8',
      document: '12345678900'
    };

    const usecase = CreateAccountUseCase.create(mockAccountsGateway, mockPeopleGateway);

    await expect(usecase.execute(input)).rejects.toThrow('Branch must be exactly 3 digits.');
  });

  it('should throw error if account format is invalid', async () => {
    const input = {
      branch: '123',
      account: '12345678',
      document: '12345678900'
    };

    const usecase = CreateAccountUseCase.create(mockAccountsGateway, mockPeopleGateway);

    await expect(usecase.execute(input)).rejects.toThrow('Account must be in the format XXXXXXX-X.');
  });

  it('should throw error if account already exists', async () => {
    const input = {
      branch: '123',
      account: '1234567-8',
      document: '12345678900'
    };

    mockAccountsGateway.findByAccount.mockResolvedValue({} as Accounts);

    const usecase = CreateAccountUseCase.create(mockAccountsGateway, mockPeopleGateway);

    await expect(usecase.execute(input)).rejects.toThrow('Account number must be unique.');
  });

  it('should throw error if person is not found', async () => {
    const input = {
      branch: '123',
      account: '1234567-8',
      document: '12345678900'
    };

    mockAccountsGateway.findByAccount.mockResolvedValue(null);
    mockPeopleGateway.findByDocument.mockResolvedValue(null);

    const usecase = CreateAccountUseCase.create(mockAccountsGateway, mockPeopleGateway);

    await expect(usecase.execute(input)).rejects.toThrow('Person not found.');
  });
});
