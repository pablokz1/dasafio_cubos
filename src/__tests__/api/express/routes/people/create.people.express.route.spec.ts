import request from 'supertest';
import { ApiExpress } from '../../../../../api/express/api.express';
import { CreatePeopleRoute } from '../../../../../api/express/routes/people/create.people.express.route';
import { CreatePeopleUsecase } from '../../../../../usecases/people/create-people.usecae';
import { AuthGatewayHttp } from '../../../../../infra/external/http/auth/auth.gateway.http';

jest.mock('../../../../../infra/external/http/auth/auth.gateway.http');
jest.mock('../../../../../usecases/people/create-people.usecae');

describe('Create People Route - Integration Test', () => {
  let mockExecute: jest.Mock;

  beforeAll(() => {
    (AuthGatewayHttp as jest.Mock).mockImplementation(() => ({
      requestCode: jest.fn().mockResolvedValue({ authCode: 'fake-auth-code' }),
      requestToken: jest.fn().mockResolvedValue({ accessToken: 'fake-access-token' }),
    }));

    mockExecute = jest.fn().mockResolvedValue({
      id: '123',
      name: 'Test Person',
      document: '12345678901',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    });

    (CreatePeopleUsecase.create as jest.Mock).mockReturnValue({
      execute: mockExecute,
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should create a new person and return 201 with person data', async () => {
    const route = CreatePeopleRoute.create();
    const api = ApiExpress.create([route]);

    const response = await request(api.getApp())
      .post('/people')
      .send({
        name: 'Test Person',
        document: '12345678901',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: '123',
      name: 'Test Person',
      document: '12345678901',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    });

    expect(mockExecute).toHaveBeenCalledWith({
      name: 'Test Person',
      document: '12345678901',
      password: 'password123',
      accessToken: 'fake-access-token',
    });
  });
});
