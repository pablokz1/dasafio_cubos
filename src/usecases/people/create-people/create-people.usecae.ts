import { People } from "../../../domain/people/entity/people.entity"
import type { PeopleGateway } from "../../../domain/people/gateway/people.gateway"
import type { Usecase } from "../../usecase"

export type CreatePeopleInputDto = {
    name: string,
    document: string,
    password: string,
}

export type CreatePeopleOutputDto = {
    id: string,
    name: string,
    document: string,
}

export class CreatePeopleUsecase implements Usecase<CreatePeopleInputDto, CreatePeopleOutputDto> {
    private constructor(private readonly peopleGateway: PeopleGateway) { }

    public static create(peopleGateway: PeopleGateway) {
        return new CreatePeopleUsecase(peopleGateway)
    }

    public async execute({ name, document, password }: CreatePeopleInputDto): Promise<CreatePeopleOutputDto> {
        const aPeople = People.create(name, document, password);

        await this.peopleGateway.save(aPeople);

        const output = this.presentOutput(aPeople);

        return output;
    }

    private presentOutput(people: People) {
        const output: CreatePeopleOutputDto = {
            id: people.id,
            name: people.name,
            document: people.document
        }

        return output;
    }
}