import { Request, Response } from "express"
import { CreatePeopleInputDto, CreatePeopleUsecase } from "../../../../../usecases/people/create-people/create-people.usecae"
import { HttpMethod, Route } from "../route"

export type CreatePeopleResponseDto = {
    id: string
}

export class CreatePeopleRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createPeopleService: CreatePeopleUsecase
    ) {}

    public static create(createPeopleService: CreatePeopleUsecase) {
        return new CreatePeopleRoute(
            "/people",
            HttpMethod.POST,
            createPeopleService
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { name, document, password } = request.body;

            const input: CreatePeopleInputDto = {
                name,
                document,
                password
            }

            const output: CreatePeopleResponseDto = 
                await this.createPeopleService.execute(input);

            const responseBody = this.present(output);

            response.status(201).json(responseBody).send();

        }
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(input: CreatePeopleResponseDto): CreatePeopleResponseDto {
        const response = { id: input.id };
        return response;
    }
}