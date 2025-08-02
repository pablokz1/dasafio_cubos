import { CardsGateway } from "../../../../domain/cards/gateway/cards.gateway";
import { Card } from "../../../../domain/cards/entity/cards.entity";

function createMockCard(): Card {
    return Card.create("account-123", "physical", "1234567890123456", "123");
}

export function createMockCardsGateway(): jest.Mocked<CardsGateway> {
    return {
        save: jest.fn().mockResolvedValue(undefined),
        listByAccountId: jest.fn().mockResolvedValue([createMockCard()]),
        findPhysicalCardByAccountId: jest.fn().mockResolvedValue(createMockCard()),
        listByAccountIds: jest.fn().mockResolvedValue([createMockCard()]),
    };
}

describe("CardsGateway", () => {
    let mockCardsGateway: jest.Mocked<CardsGateway>;

    beforeEach(() => {
        mockCardsGateway = createMockCardsGateway();
    });

    it("should save a card", async () => {
        const card = createMockCard();
        await mockCardsGateway.save(card);
        expect(mockCardsGateway.save).toHaveBeenCalledWith(card);
    });

    it("should list cards by accountId", async () => {
        const cards = await mockCardsGateway.listByAccountId("account-123");
        expect(cards.length).toBeGreaterThan(0);
        expect(mockCardsGateway.listByAccountId).toHaveBeenCalledWith("account-123");
    });

    it("should find physical card by accountId", async () => {
        const card = await mockCardsGateway.findPhysicalCardByAccountId("account-123");
        expect(card).not.toBeNull();
        expect(mockCardsGateway.findPhysicalCardByAccountId).toHaveBeenCalledWith("account-123");
    });

    it("should list cards by multiple accountIds with pagination", async () => {
        const cards = await mockCardsGateway.listByAccountIds(["account-123", "account-456"], 10, 1);
        expect(cards.length).toBeGreaterThan(0);
        expect(mockCardsGateway.listByAccountIds).toHaveBeenCalledWith(["account-123", "account-456"], 10, 1);
    });
});
