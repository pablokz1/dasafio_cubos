import { AuthGateway } from "../../../domain/auth/gateway/auth.gateway";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export class AuthRepository implements AuthGateway {
    constructor(private readonly prisma: PrismaClient) { }

    async login(document: string, password: string): Promise<string> {
        const cleanDoc = document.replace(/[^\d]/g, "");

        const user = await this.prisma.people.findUnique({
            where: { document: cleanDoc },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Comparando com a senha do banco (em texto simples)
        if (password !== user.password) {
            throw new Error("Invalid credentials");
        }

        const token = sign(
            { sub: user.id, document: user.document, name: user.name },
            process.env.JWT_SECRET || "default_jwt_secret",
            { expiresIn: "1h" }
        );

        return `Bearer ${token}`;
    }
}
