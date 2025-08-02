import { Accounts } from "../../domain/accounts/entity/accounts.entity";
import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";
import { Usecase } from "../usecase";
import { CreateAccountOutputDto } from "./create-account.usecase";


export type ListAccountsInputDto = {
    idPeople: string;
};

export type ListAccountsOutputDto = {
    accounts: CreateAccountOutputDto[];
};

export class ListAccountsByPeopleUseCase implements Usecase<ListAccountsInputDto, ListAccountsOutputDto> {
    constructor(private readonly accountsGateway: AccountsGateway) { }

    public static create(accountsGateway: AccountsGateway) {
        return new ListAccountsByPeopleUseCase(accountsGateway);
    }

    async execute(input: ListAccountsInputDto): Promise<ListAccountsOutputDto> {
        const aAccounts = await this.accountsGateway.listByPersonId(input.idPeople);

        const output = this.presentOutput(aAccounts);

        return output;
    }

    private presentOutput(accounts: Accounts[]): ListAccountsOutputDto {
        return {
            accounts: accounts.map((a) => {
                return {
                    id: a.id,
                    account: a.account,
                    branch: a.branch,
                    createdAt: a.createdAt,
                    updatedAt: a.updatedAt,
                }
            })
        }
    }
}