import type { People } from "../../../../domain/people/entity/people.entity";
import type { PeopleGateway } from "../../../../domain/people/gateway/people.gateway";

function createMockPeopleGateway(): jest.Mocked<PeopleGateway> {
    return {
        save: jest.fn(),
        list: jest.fn(),
        findById: jest.fn(),
        findByDocument: jest.fn(),
    };
}

describe("PeopleGateway", () => {
    let mockGateway: jest.Mocked<PeopleGateway>;

    beforeEach(() => {
        mockGateway = createMockPeopleGateway();
    });

    it("should save a person", async () => {
        const mockPerson = {} as People;
        mockGateway.save.mockResolvedValue();

        await mockGateway.save(mockPerson);

        expect(mockGateway.save).toHaveBeenCalledWith(mockPerson);
    });

    it("should list people", async () => {
        const mockPeopleList = [
            { id: "1", name: "Alice", document: "123", password: "pass", createdAt: new Date(), updatedAt: new Date() },
            { id: "2", name: "Bob", document: "456", password: "pass", createdAt: new Date(), updatedAt: new Date() },
        ] as People[];

        mockGateway.list.mockResolvedValue(mockPeopleList);

        const result = await mockGateway.list();

        expect(result).toBe(mockPeopleList);
        expect(mockGateway.list).toHaveBeenCalled();
    });

    it("should find a person by id", async () => {
        const mockPerson = { id: "1" } as People;
        mockGateway.findById.mockResolvedValue(mockPerson);

        const result = await mockGateway.findById("1");

        expect(result).toBe(mockPerson);
        expect(mockGateway.findById).toHaveBeenCalledWith("1");
    });

    it("should find a person by document", async () => {
        const mockPersonId = { id: "1" };
        mockGateway.findByDocument.mockResolvedValue(mockPersonId);

        const result = await mockGateway.findByDocument("123456789");

        expect(result).toBe(mockPersonId);
        expect(mockGateway.findByDocument).toHaveBeenCalledWith("123456789");
    });

    it("should return null if person not found by id", async () => {
        mockGateway.findById.mockResolvedValue(null);

        const result = await mockGateway.findById("non-existent-id");

        expect(result).toBeNull();
    });

    it("should return null if person not found by document", async () => {
        mockGateway.findByDocument.mockResolvedValue(null);

        const result = await mockGateway.findByDocument("non-existent-document");

        expect(result).toBeNull();
    });
});