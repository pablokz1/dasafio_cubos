import { ListPeopleUsecase } from '../../../usecases/people/list-people.usecase';
import { PeopleGateway } from '../../../domain/people/gateway/people.gateway';
import { People } from '@prisma/client';

describe('ListPeopleUsecase', () => {
    let mockPeopleGateway: jest.Mocked<PeopleGateway>;

    beforeEach(() => {
        mockPeopleGateway = {
            list: jest.fn(),
        } as unknown as jest.Mocked<PeopleGateway>;
    });

    it('should list all people and return them in the correct format', async () => {
        const mockPeopleList: People[] = [
            {
                id: '1',
                name: 'Alice',
                document: '12345678900',
                password: 'hash1',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            },
            {
                id: '2',
                name: 'Bob',
                document: '98765432100',
                password: 'hash2',
                createdAt: new Date('2024-02-01'),
                updatedAt: new Date('2024-02-02'),
            }
        ];

        mockPeopleGateway.list.mockResolvedValue(mockPeopleList);

        const usecase = ListPeopleUsecase.create(mockPeopleGateway);
        const result = await usecase.execute();

        expect(result.peoples.length).toBe(2);
        expect(result.peoples[0]).toEqual({
            id: '1',
            name: 'Alice',
            document: '12345678900',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
        });
        expect(result.peoples[1]).toEqual({
            id: '2',
            name: 'Bob',
            document: '98765432100',
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-02'),
        });
        expect(mockPeopleGateway.list).toHaveBeenCalledTimes(1);
    });
});
