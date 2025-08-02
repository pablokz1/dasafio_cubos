import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { ListPeopleOutputDto, ListPeopleUsecase } from "../../../../usecases/people/list-people.usecase";

export type ListPeopleResponseDto = {
    peoples: {
        id: string,
        name: string,
        document: string,
        createdAt: Date,
        updatedAt: Date,
    }[];
}

export class ListPeopleRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listPeopleService: ListPeopleUsecase,
    ) { }

    public static create(listPeopleService: ListPeopleUsecase) {
        return new ListPeopleRoute(
            "/people",
            HttpMethod.GET,
            listPeopleService,
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const output = await this.listPeopleService.execute();

            const responseBody = this.present(output);

            response.status(200).json(responseBody).send();
        }
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(input: ListPeopleOutputDto): ListPeopleResponseDto {
        const response: ListPeopleResponseDto = {
            peoples: input.peoples.map(p => ({
                id: p.id,
                name: p.name,
                document: p.document,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }))
        }

        return response;
    }
}