import { Auth } from "../../../domain/auth/entity/auth.entity";
import { AuthGateway } from "../../../domain/auth/gateway/auth.gateway";
import { Usecase } from "../../usecase";

export type LoginUseCaseInput = {
    document: string;
    password: string;
};

export type LoginUseCaseOutput = {
    token: string;
};

export class LoginUseCase implements Usecase<LoginUseCaseInput, LoginUseCaseOutput> {
    constructor(private authGateway: AuthGateway) {}

    async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
        const auth = Auth.create(input.document, input.password);
        const token = await this.authGateway.login(auth.document, auth.password);
        return { token };
    }
}
