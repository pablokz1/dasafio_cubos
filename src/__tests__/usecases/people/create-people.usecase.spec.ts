import { CreatePeopleUsecase } from '../../../usecases/people/create-people.usecae';
import { PeopleGateway } from '../../../domain/people/gateway/people.gateway';
import { ValidateGateway } from '../../../infra/external/domain/validate/gateway/validate.gateway';

describe('CreatePeopleUsecase', () => {
  const mockPeopleGateway: jest.Mocked<PeopleGateway> = {
    findByDocument: jest.fn(),
    save: jest.fn(),
  };

  const mockValidateGateway: jest.Mocked<ValidateGateway> = {
    validateCpf: jest.fn(),
    validateCnpj: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new person when document is valid and not exists', async () => {
    const input = {
      name: 'Test Person',
      document: '12345678900',
      password: 'password123',
      accessToken: 'valid-token',
    };

    mockPeopleGateway.findByDocument.mockResolvedValue(null);

    mockValidateGateway.validateCpf.mockResolvedValue({
      isValid: () => true
    });

    mockPeopleGateway.save.mockImplementation(async () => Promise.resolve());

    const usecase = CreatePeopleUsecase.create(mockPeopleGateway, mockValidateGateway);

    const result = await usecase.execute(input);

    expect(result.name).toBe('Test Person');
    expect(result.document).toBe('12345678900');
    expect(mockPeopleGateway.findByDocument).toHaveBeenCalledWith('12345678900');
    expect(mockPeopleGateway.save).toHaveBeenCalled();
    expect(result.id).toBeDefined();
  });
});
