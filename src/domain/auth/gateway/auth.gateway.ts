export interface AuthGateway {
    login(document: string, password: string): Promise<string>;
}
