import { People } from "@prisma/client";
import { PeopleGateway } from "../../domain/people/gateway/people.gateway";
import { Usecase } from "../usecase";

export type ListPeopleInputDto = void;

export type ListPeopleOutputDto = {
    peoples: {
        id: string,
        name: string,
        document: string,
        createdAt: Date,
        updatedAt: Date,
    }[];
}

export class ListPeopleUsecase implements Usecase<ListPeopleInputDto, ListPeopleOutputDto> {
    private constructor(private readonly peopleGateway: PeopleGateway) { }

    public static create(peopleGateway: PeopleGateway) {
        return new ListPeopleUsecase(peopleGateway);
    }

    public async execute(): Promise<ListPeopleOutputDto> {
        const aPeople = await this.peopleGateway.list();

        const output = this.presentOutput(aPeople);

        return output;
    }

    private presentOutput(peoples: People[]): ListPeopleOutputDto {
        return {
            peoples: peoples.map((p) => {
                return {
                    id: p.id,
                    name: p.name,
                    document: p.document,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                }
            })
        }
    }
}