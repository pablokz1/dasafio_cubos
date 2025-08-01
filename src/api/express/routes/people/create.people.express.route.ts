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
    EMAIL = process.env.EMAIL as string;
    PASSWORD = process.env.PASSWORD as string;

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
                // 1. Autentica para obter o código e o token
                const { authCode } = await authGateway.requestCode(this.EMAIL, this.PASSWORD);
                const { accessToken } = await authGateway.requestToken(authCode);

                // 2. Chama o usecase passando o accessToken
                const input: CreatePeopleInputDto = {
                    name,
                    document,
                    password,
                    accessToken, // token obtido aqui
                };

                const output: CreatePeopleResponseDto = await this.createPeopleService.execute(input);

                const responseBody = this.present(output);

                response.status(201).json({
                    success: true,
                    data: responseBody,
                });

            } catch (error) {
                console.error(`[${new Date().toISOString()}] Erro ao criar pessoa:`, error);

                if (error instanceof Error) {
                    response.status(400).json({
                        success: false,
                        message: error.message,
                    });
                    return;
                }

                response.status(500).json({
                    success: false,
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
