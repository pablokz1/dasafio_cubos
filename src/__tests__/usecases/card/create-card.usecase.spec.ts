import { CreateCardUseCase } from "../../../usecases/cards/create-card.usecase";
import { CardsGateway } from "../../../domain/cards/gateway/cards.gateway";
import { AccountsGateway } from "../../../domain/accounts/gateway/acconts.gateway";
import { Card } from "../../../domain/cards/entity/cards.entity";

const mockCardsGateway: jest.Mocked<CardsGateway> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByAccountId: jest.fn(),
    findPhysicalCardByAccountId: jest.fn(),
};

const mockAccountsGateway: jest.Mocked<AccountsGateway> = {
    findById: jest.fn(),
    save: jest.fn(),
    listByPersonId: jest.fn(),
};

describe("CreateCardUseCase", () => {
    const useCase = new CreateCardUseCase(mockCardsGateway, mockAccountsGateway);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a virtual card successfully", async () => {
        const input = {
            accountId: "acc-123",
            type: "virtual",
            number: "1234 5678 9012 3456",
            cvv: "123",
        };

        mockAccountsGateway.findById.mockResolvedValue({ id: "acc-123" } as any);
        mockCardsGateway.findPhysicalCardByAccountId.mockResolvedValue(null);

        const result = await useCase.execute(input);

        expect(mockAccountsGateway.findById).toHaveBeenCalledWith("acc-123");
        expect(mockCardsGateway.save).toHaveBeenCalled();
        expect(result).toHaveProperty("id");
        expect(result.type).toBe("virtual");
        expect(result.number).toBe("3456");
        expect(result.cvv).toBe("123");
    });

    it("should throw error for invalid CVV", async () => {
        const input = {
            accountId: "acc-123",
            type: "virtual",
            number: "1111 2222 3333 4444",
            cvv: "12",
        };

        await expect(useCase.execute(input)).rejects.toThrow("CVV must have exactly 3 digits.");
    });

    it("should throw error for invalid card type", async () => {
        const input = {
            accountId: "acc-123",
            type: "invalid-type" as any,
            number: "1111 2222 3333 4444",
            cvv: "123",
        };

        await expect(useCase.execute(input)).rejects.toThrow("Card type must be 'physical' or 'virtual'.");
    });

    it("should throw error if account not found", async () => {
        const input = {
            accountId: "nonexistent",
            type: "virtual",
            number: "1111 2222 3333 4444",
            cvv: "123",
        };

        mockAccountsGateway.findById.mockResolvedValue(null);

        await expect(useCase.execute(input)).rejects.toThrow("Account not found.");
    });

    it("should not allow multiple physical cards per account", async () => {
        const input = {
            accountId: "acc-123",
            type: "physical",
            number: "1111 2222 3333 4444",
            cvv: "123",
        };

        mockAccountsGateway.findById.mockResolvedValue({ id: "acc-123" } as any);
        mockCardsGateway.findPhysicalCardByAccountId.mockResolvedValue(
            Card.create("acc-123", "physical", "1111222233334444", "123")
        );

        await expect(useCase.execute(input)).rejects.toThrow("Only one physical card allowed per account.");
    });
});
