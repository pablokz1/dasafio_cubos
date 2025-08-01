import { People } from "../../../domain/people/entity/people.entity";
import type { PeopleGateway } from "../../../domain/people/gateway/people.gateway";
import { ValidateGateway } from "../../../infra/external/domain/validate/gateway/validate.gateway";
import type { Usecase } from "../../usecase";
import bcrypt from 'bcrypt';

export type CreatePeopleInputDto = {
  name: string;
  document: string;
  password: string;
  accessToken: string;
};

export type CreatePeopleOutputDto = {
  id: string;
  name: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CreatePeopleUsecase implements Usecase<CreatePeopleInputDto, CreatePeopleOutputDto> {
  private constructor(
    private readonly peopleGateway: PeopleGateway,
    private readonly validateGateway: ValidateGateway
  ) { }

  public static create(peopleGateway: PeopleGateway, validateGateway: ValidateGateway) {
    return new CreatePeopleUsecase(peopleGateway, validateGateway);
  }

  public async execute({ name, document, password, accessToken }: CreatePeopleInputDto): Promise<CreatePeopleOutputDto> {
    const doc = document.replace(/[\.\-\/]/g, "");

    const existingPerson = await this.peopleGateway.findByDocument(doc);
    if (existingPerson) {
      throw new Error("Document already exists");
    }

    let result;
    if (/^\d{11}$/.test(doc)) {
      result = await this.validateGateway.validateCpf(doc, accessToken);
    } else if (/^\d{14}$/.test(doc)) {
      result = await this.validateGateway.validateCnpj(doc, accessToken);
    } else {
      throw new Error("Invalid document: enter a CPF (11 digits) or CNPJ (14 digits)");
    }

    if (!result.isValid()) {
      throw new Error("Document not approved");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const aPeople = People.create(name, doc, hashedPassword);
    await this.peopleGateway.save(aPeople);
    return this.presentOutput(aPeople);
  }

  private presentOutput(people: People): CreatePeopleOutputDto {
    return {
      id: people.id,
      name: people.name,
      document: people.document,
      createdAt: people.createdAt,
      updatedAt: people.updatedAt
    };
  }
}
