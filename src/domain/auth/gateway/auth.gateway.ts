import { Auth } from "../entity/auth.entity";

export interface AuthGateway {
    login(document: string, password: string): Promise<string>;
    findByDocument(document: string): Promise<Auth | null>;
}
