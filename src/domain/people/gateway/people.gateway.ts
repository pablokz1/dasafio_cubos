import type { People } from "../entity/people.entity";

export interface PeopleGateway {
    save(people: People): Promise<void>;
    list(): Promise<People[]>;
    findById(id: string): Promise<People | null>;
    findByDocument(document: string): Promise<{ id: string } | null>;
}