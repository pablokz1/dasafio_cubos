import { PrismaClient } from "@prisma/client";
import { People } from "../../../domain/people/entity/people.entity";
import { PeopleGateway } from "../../../domain/people/gateway/people.gateway";

export class PeopleRepositoryPrisma implements PeopleGateway {
    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new PeopleRepositoryPrisma(prismaClient);
    }

    public async save(people: People): Promise<void> {
        const data = {
            id: people.id,
            name: people.name,
            document: people.document,
            password: people.password,
            createdAt: people.createdAt,
            updatedAt: people.updatedAt,
        };

        await this.prismaClient.people.create({ data });
    }

    public async list(): Promise<People[]> {
        const peoples = await this.prismaClient.people.findMany();

        return peoples.map(p =>
            People.with({
                id: p.id,
                name: p.name,
                document: p.document,
                password: p.password,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            })
        );
    }

    public async findById(id: string): Promise<People> {
        const p = await this.prismaClient.people.findUnique({ where: { id } });

        if (!p) {
            throw new Error(`People not found with ID: ${id}`);
        }

        return People.with({
            id: p.id,
            name: p.name,
            document: p.document,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            password: p.password,
        });
    }

    async findByDocument(document: string): Promise<People | null> {
        const p = await this.prismaClient.people.findUnique({
            where: { document },
        });

        if (!p) return null;

        return People.with({
            id: p.id,
            name: p.name,
            document: p.document,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            password: p.password,
        });
    }

    public async findByName(name: string): Promise<People> {
        const p = await this.prismaClient.people.findFirst({ where: { name } });

        if (!p) {
            throw new Error(`People not found with name: ${name}`);
        }

        return People.with({
            id: p.id,
            name: p.name,
            document: p.document,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            password: p.password,
        });
    }

    public async delete(id: string): Promise<void> {
        await this.prismaClient.people.delete({ where: { id } });
    }

    public async update(people: People): Promise<void> {
        const data = {
            name: people.name,
            document: people.document,
            password: people.password,
            updatedAt: people.updatedAt,
        };

        await this.prismaClient.people.update({
            where: { id: people.id },
            data,
        });
    }
}
