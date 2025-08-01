import { Request, Response } from "express";
import { CreatePeopleInputDto, CreatePeopleUsecase } from "../../../../usecases/people/create-people/create-people.usecae";
import { HttpMethod, Route } from "../route";
import { PeopleRepositoryPrisma } from "../../../../infra/repository/people/people.repository.prisma";
import { PrismaClient } from "@prisma/client";
import { ValidateGatewayHttp } from "../../../../infra/httpGateway/validate/validate.gateway.http";
import { AuthGatewayHttp } from "../../../../infra/httpGateway/auth/auth.gateway.http";

export type CreatePeopleResponseDto = {
    id: string,
    name: string,
    document: string,
    createdAt: Date,
    updatedAt: Date,
}

export class CreatePeopleRoute implements Route {
    EMAIL = process.env.EMAIL!;
    PASSWORD = process.env.PASSWORD!;

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createPeopleService: CreatePeopleUsecase
    ) { }

    public static create() {
        const peopleRepository = PeopleRepositoryPrisma.create(new PrismaClient());
        const validateGateway = new ValidateGatewayHttp();
        const createPeopleService = CreatePeopleUsecase.create(peopleRepository, validateGateway);
        return new CreatePeopleRoute("/people", HttpMethod.POST, createPeopleService);
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const { name, document, password } = request.body;

            const authGateway = new AuthGatewayHttp();

            try {
                const { authCode } = await authGateway.requestCode();
                const { accessToken } = await authGateway.requestToken(authCode);

                const input: CreatePeopleInputDto = {
                    name,
                    document,
                    password,
                    accessToken,
                };

                const output: CreatePeopleResponseDto = await this.createPeopleService.execute(input);

                const responseBody = this.present(output);

                response.status(201).json(responseBody);

            } catch (error) {
                if (error instanceof Error) {
                    response.status(400).json({
                        message: error.message,
                    });
                    return;
                }

                response.status(500).json({
                    message: "Internal Server Error",
                });
            }
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(input: CreatePeopleResponseDto): CreatePeopleResponseDto {
        return {
            id: input.id,
            name: input.name,
            document: input.document,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        };
    }
}
