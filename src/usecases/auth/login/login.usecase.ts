import { AuthGateway } from "../../../domain/auth/gateway/auth.gateway";
import { Usecase } from "../../usecase";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export type LoginUseCaseInput = {
    document: string;
    password: string;
};

export type LoginUseCaseOutput = {
    token: string;
};

export class LoginUseCase implements Usecase<LoginUseCaseInput, LoginUseCaseOutput> {
    constructor(private authGateway: AuthGateway) { }

    async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
        const { document, password } = input;

        const auth = await this.authGateway.findByDocument(document);
        if (!auth) {
            throw new Error("Document not found");
        }

        const isValidPassword = await bcrypt.compare(password, auth.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            { document: auth.document },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1h' }
        );

        return { token };
    }
}
