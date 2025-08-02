import { People, PeopleProps } from "../../../../domain/people/entity/people.entity";

describe("People Entity", () => {
    const fixedDate = new Date("2025-01-01T12:00:00Z");

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(fixedDate);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe("create()", () => {
        it("should create a People instance with correct properties and default timestamps", () => {
            const name = "John Doe";
            const document = "12345678900";
            const password = "hashedPassword";

            const person = People.create(name, document, password);

            expect(person).toBeInstanceOf(People);
            expect(person.name).toBe(name);
            expect(person.document).toBe(document);
            expect(person.password).toBe(password);
            expect(person.createdAt).toEqual(fixedDate);
            expect(person.updatedAt).toEqual(fixedDate);
            expect(person.id).toBeDefined();
            expect(typeof person.id).toBe("string");
        });
    });

    describe("with()", () => {
        it("should create a People instance from given props", () => {
            const props: PeopleProps = {
                id: "uuid-1234",
                name: "Jane Doe",
                document: "98765432100",
                password: "anotherHash",
                createdAt: fixedDate,
                updatedAt: fixedDate,
            };

            const person = People.with(props);

            expect(person).toBeInstanceOf(People);
            expect(person.name).toBe(props.name);
            expect(person.document).toBe(props.document);
            expect(person.password).toBe(props.password);
            expect(person.createdAt).toEqual(fixedDate);
            expect(person.updatedAt).toEqual(fixedDate);
            expect(person.id).toBe(props.id);
        });
    });

    describe("getters", () => {
        it("should return correct property values", () => {
            const props: PeopleProps = {
                id: "uuid-5678",
                name: "Alice",
                document: "11122233344",
                password: "passwordHash",
                createdAt: fixedDate,
                updatedAt: fixedDate,
            };

            const person = People.with(props);

            expect(person.name).toBe(props.name);
            expect(person.document).toBe(props.document);
            expect(person.password).toBe(props.password);
            expect(person.id).toBe(props.id);
            expect(person.createdAt).toEqual(fixedDate);
            expect(person.updatedAt).toEqual(fixedDate);
        });
    });
});
