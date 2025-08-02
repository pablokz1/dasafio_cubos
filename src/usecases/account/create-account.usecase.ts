import { Accounts } from "../../domain/accounts/entity/accounts.entity";
import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";
import { PeopleGateway } from "../../domain/people/gateway/people.gateway";
import { Usecase } from "../usecase";

export type CreateAccountInputDto = {
    branch: string;
    account: string;
    document: string;
};

export type CreateAccountOutputDto = {
    id: string;
    branch: string;
    account: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateAccountUseCase implements Usecase<CreateAccountInputDto, CreateAccountOutputDto> {
    private constructor(
        private readonly accountsGateway: AccountsGateway,
        private readonly peopleGateway: PeopleGateway,
    ) {}

    public static create(accountsGateway: AccountsGateway, peopleGateway: PeopleGateway) {
        return new CreateAccountUseCase(accountsGateway, peopleGateway);
    }

    async execute(input: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
        const { branch, account, document } = input;

        if (!/^[0-9]{3}$/.test(branch)) {
            throw new Error("Branch must be exactly 3 digits.");
        }

        if (!/^[0-9]{7}-[0-9]{1}$/.test(account)) {
            throw new Error("Account must be in the format XXXXXXX-X.");
        }

        const existingAccount = await this.accountsGateway.findByAccount(account);
        if (existingAccount) {
            throw new Error("Account number must be unique.");
        }

        const person = await this.peopleGateway.findByDocument(document);
        if (!person) {
            throw new Error("Person not found.");
        }

        const accountEntity = Accounts.create(branch, account, person.id);
        await this.accountsGateway.save(accountEntity);

        return this.presentOutput(accountEntity);
    }

    private presentOutput(accounts: Accounts): CreateAccountOutputDto {
        return {
            id: accounts.id,
            account: accounts.account,
            branch: accounts.branch,
            createdAt: accounts.createdAt,
            updatedAt: accounts.updatedAt,
        };
    }
}
