import type { People } from "../entity/people.entity.js";

export interface PeopleGateway {
    save(people: People): Promise<void>;

    list(): Promise<People[]>;

    findById(id: string): Promise<People | null>;

    findByDocument(document: string): Promise<People | null>;

    findByName(name: string): Promise<People | null>;

    delete(id: string): Promise<void>;

    update(people: People): Promise<void>;
}