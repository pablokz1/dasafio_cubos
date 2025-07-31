import { People } from "../../../domain/people/entity/people.entity.js"
import type { PeopleGateway } from "../../../domain/people/gateway/people.gateway.js"
import type { Usecase } from "../../usecase.js"

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
    private constructor(private readonly peopleGateway: PeopleGateway) {}
    
    public static create(peopleGateway: PeopleGateway) {
     return new CreatePeopleUsecase(peopleGateway)
    }

    public async execute({name, document, password}: CreatePeopleInputDto): Promise<CreatePeopleOutputDto> {
        const aPeople = People.create(name, document, password);

        await this.peopleGateway.save(aPeople);

        const output: CreatePeopleOutputDto = {
            id: aPeople.id,
            name: aPeople.name,
            document: aPeople.document,
        }

        return output;
    }
}