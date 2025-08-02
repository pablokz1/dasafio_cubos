import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "../../../../infra/repository/auth/auth.repository";
import { LoginUseCase } from "../../../../usecases/auth/login.usecase";

export type LoginResponseDto = {
    token: string;
};

export class LoginExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly loginService: LoginUseCase
    ) { }

    static create() {
        const prisma = new PrismaClient();               
        const authRepository = new AuthRepository(prisma); 
        const loginService = new LoginUseCase(authRepository);
        return new LoginExpressRoute("/login", HttpMethod.POST, loginService);
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            const { document, password } = request.body;

            try {
                const output: LoginResponseDto = await this.loginService.execute({
                    document,
                    password,
                });

                const responseBody = this.present(output);

                response.status(200).json(responseBody);
            } catch (error) {
                if (error instanceof Error) {
                    response.status(401).json({ message: error.message });
                } else {
                    response.status(500).json({ message: "Internal Server Error" });
                }
            }
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(input: LoginResponseDto): LoginResponseDto {
        return {
            token: input.token,
        };
    }
}
