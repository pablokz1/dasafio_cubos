import { Usecase } from "../usecase";
import { AccountsGateway } from "../../domain/accounts/gateway/acconts.gateway";

export type GetBalanceInputDto = {
    accountId: string;
};

export type GetBalanceOutputDto = {
    balance: number;
};

export class GetBalanceUseCase implements Usecase<GetBalanceInputDto, GetBalanceOutputDto> {
    constructor(private readonly accountsGateway: AccountsGateway) { }

    async execute(input: GetBalanceInputDto): Promise<GetBalanceOutputDto> {
        const account = await this.accountsGateway.findById(input.accountId);

        if (!account) {
            throw new Error("Conta não encontrada.");
        }

        return {
            balance: account.balance,
        };
    }
}
