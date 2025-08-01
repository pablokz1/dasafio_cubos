import { Auth } from "../../../domain/auth/entity/auth.entity";
import { AuthGateway } from "../../../domain/auth/gateway/auth.gateway";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthRepository implements AuthGateway {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findByDocument(document: string): Promise<Auth | null> {
        const user = await this.prisma.people.findUnique({
            where: { document },
        });

        if (!user) {
            return null;
        }

        return Auth.with({
            document: user.document,
            password: user.password,
        });
    }

    async login(document: string, password: string): Promise<string> {
        const auth = await this.findByDocument(document);
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

        return token;
    }
}
