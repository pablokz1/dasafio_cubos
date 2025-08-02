import { ListCardsByAccountUseCase } from "../../../usecases/cards/list-cards.usecase";
import { CardsGateway } from "../../../domain/cards/gateway/cards.gateway";

describe("ListCardsByAccountUseCase", () => {
    const mockCardsGateway: jest.Mocked<CardsGateway> = {
        save: jest.fn(),
        findById: jest.fn(),
        findByAccountId: jest.fn(),
        findPhysicalCardByAccountId: jest.fn(),
        listByAccountIds: jest.fn(),
        listByAccountId: jest.fn(),
    };

    const useCase = ListCardsByAccountUseCase.create(mockCardsGateway);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a list of cards for a given account", async () => {
        const now = new Date();

        mockCardsGateway.listByAccountId.mockResolvedValue([
            {
                id: "card-1",
                accountId: "acc-123",
                type: "virtual",
                number: "1234123412341234",
                cvv: "123",
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "card-2",
                accountId: "acc-123",
                type: "physical",
                number: "4321432143214321",
                cvv: "456",
                createdAt: now,
                updatedAt: now,
            },
        ] as any);

        const result = await useCase.execute({ accountId: "acc-123" });

        expect(mockCardsGateway.listByAccountId).toHaveBeenCalledWith("acc-123");
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            id: "card-1",
            type: "virtual",
            number: "1234123412341234",
            cvv: "123",
            createdAt: now,
            updatedAt: now,
        });
    });

    it("should return an empty array if there are no cards", async () => {
        mockCardsGateway.listByAccountId.mockResolvedValue([]);

        const result = await useCase.execute({ accountId: "acc-empty" });

        expect(mockCardsGateway.listByAccountId).toHaveBeenCalledWith("acc-empty");
        expect(result).toEqual([]);
    });
});
