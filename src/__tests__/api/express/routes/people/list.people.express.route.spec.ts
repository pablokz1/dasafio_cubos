import request from 'supertest';
import { ApiExpress } from '../../../../../api/express/api.express';
import { ListPeopleRoute } from '../../../../../api/express/routes/people/list.people.express.route';
import { ListPeopleUsecase } from '../../../../../usecases/people/list-people.usecase';

jest.mock('../../../../../usecases/people/list-people.usecase');

describe('List People Route - Integration Test', () => {
    let mockExecute: jest.Mock;

    beforeAll(() => {
        mockExecute = jest.fn().mockResolvedValue({
            peoples: [
                {
                    id: '1',
                    name: 'Person One',
                    document: '12345678901',
                    createdAt: new Date('2025-01-01T00:00:00Z'),
                    updatedAt: new Date('2025-01-02T00:00:00Z'),
                },
                {
                    id: '2',
                    name: 'Person Two',
                    document: '98765432100',
                    createdAt: new Date('2025-01-03T00:00:00Z'),
                    updatedAt: new Date('2025-01-04T00:00:00Z'),
                }
            ]
        });

        (ListPeopleUsecase.create as jest.Mock).mockReturnValue({
            execute: mockExecute,
        });
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should return 200 and a list of people', async () => {
        const listPeopleUsecaseInstance = ListPeopleUsecase.create();
        const route = ListPeopleRoute.create(listPeopleUsecaseInstance);
        const api = ApiExpress.create([route]);

        const response = await request(api.getApp())
            .get('/people')
            .send();

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            peoples: [
                {
                    id: '1',
                    name: 'Person One',
                    document: '12345678901',
                    createdAt: '2025-01-01T00:00:00.000Z',
                    updatedAt: '2025-01-02T00:00:00.000Z',
                },
                {
                    id: '2',
                    name: 'Person Two',
                    document: '98765432100',
                    createdAt: '2025-01-03T00:00:00.000Z',
                    updatedAt: '2025-01-04T00:00:00.000Z',
                }
            ],
        });

        expect(mockExecute).toHaveBeenCalledTimes(1);
    });
});
