import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { PrismaClient } from "@prisma/client";
import { AccountsRepositoryPrisma } from "../../../../infra/repository/accounts/accounts.repository.prisma";
import { PeopleRepositoryPrisma } from "../../../../infra/repository/people/people.repository.prisma";
import { authMiddleware } from "../../middlewares/auth.middleware";
import jwt from "jsonwebtoken";
import { ListAccountsByPeopleUseCase } from "../../../../usecases/accounts/list-accounts/list-account-bypeople.usecase";

export type ListAccountsByPersonResponseDto = {
    accounts: {
        id: string;
        branch: string;
        account: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListAccountsByPeopleExpressRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listAccountsByPeopleUseCase: ListAccountsByPeopleUseCase,
        private readonly peopleRepository: PeopleRepositoryPrisma,
    ) { }

    static create() {
        const prisma = new PrismaClient();
        const accountsRepository = new AccountsRepositoryPrisma(prisma);
        const peopleRepository = PeopleRepositoryPrisma.create(prisma);
        const listAccountsByPersonUseCase = new ListAccountsByPeopleUseCase(accountsRepository);

        return new ListAccountsByPeopleExpressRoute(
            "/people/accounts",
            HttpMethod.GET,
            listAccountsByPersonUseCase,
            peopleRepository,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response): Promise<void> => {
            try {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    response.status(401).json({ message: "Authorization header missing" });
                    return;
                }
                const token = authHeader.split(" ")[1];
                if (!token) {
                    response.status(401).json({ message: "Token missing" });
                    return;
                }

                let decoded: any;
                try {
                    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
                } catch {
                    response.status(401).json({ message: "Invalid token" });
                    return;
                }

                const document = decoded.document;
                if (!document) {
                    response.status(401).json({ message: "Document missing in token" });
                    return;
                }

                const person = await this.peopleRepository.findByDocument(document);
                if (!person) {
                    response.status(404).json({ message: "Person not found" });
                    return;
                }

                const output = await this.listAccountsByPeopleUseCase.execute({ idPeople: person.id });

                response.status(200).json(this.present(output));
            } catch (error) {
                if (error instanceof Error) {
                    response.status(400).json({ message: error.message });
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

    public getMiddlewares() {
        return [authMiddleware];
    }

    private present(input: ListAccountsByPersonResponseDto) {
        return input;
    }
}
