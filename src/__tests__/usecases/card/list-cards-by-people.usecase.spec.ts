import { ListCardsByPeopleUseCase } from "../../../usecases/cards/list-cards-beypeople.usecase";
import { CardsGateway } from "../../../domain/cards/gateway/cards.gateway";
import { AccountsGateway } from "../../../domain/accounts/gateway/acconts.gateway";
import { Card } from "../../../domain/cards/entity/cards.entity";

describe("ListCardsByPeopleUseCase", () => {
  const mockCardsGateway: jest.Mocked<CardsGateway> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByAccountId: jest.fn(),
    findPhysicalCardByAccountId: jest.fn(),
    listByAccountIds: jest.fn(),
  };

  const mockAccountsGateway: jest.Mocked<AccountsGateway> = {
    findById: jest.fn(),
    save: jest.fn(),
    listByPersonId: jest.fn(),
  };

  const useCase = new ListCardsByPeopleUseCase(mockCardsGateway, mockAccountsGateway);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a paginated list of cards for a person", async () => {
    mockAccountsGateway.listByPersonId.mockResolvedValue([
      { id: "acc-1" },
      { id: "acc-2" },
    ] as any);

    const now = new Date();

    mockCardsGateway.listByAccountIds.mockResolvedValue([
      {
        id: "card-1",
        accountId: "acc-1",
        type: "virtual",
        number: "1111222233334444",
        cvv: "123",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "card-2",
        accountId: "acc-2",
        type: "physical",
        number: "5555666677778888",
        cvv: "456",
        createdAt: now,
        updatedAt: now,
      },
    ] as any);

    const result = await useCase.execute({
      personId: "person-123",
      itemsPerPage: 5,
      currentPage: 2,
    });

    expect(mockAccountsGateway.listByPersonId).toHaveBeenCalledWith("person-123");
    expect(mockCardsGateway.listByAccountIds).toHaveBeenCalledWith(["acc-1", "acc-2"], 5, 2);

    expect(result.cards).toHaveLength(2);
    expect(result.pagination).toEqual({ itemsPerPage: 5, currentPage: 2 });
  });

  it("should use default pagination if none is provided", async () => {
    mockAccountsGateway.listByPersonId.mockResolvedValue([{ id: "acc-1" }] as any);
    mockCardsGateway.listByAccountIds.mockResolvedValue([]);

    const result = await useCase.execute({ personId: "person-abc" });

    expect(mockCardsGateway.listByAccountIds).toHaveBeenCalledWith(["acc-1"], 10, 1);
    expect(result.cards).toEqual([]);
    expect(result.pagination).toEqual({ itemsPerPage: 10, currentPage: 1 });
  });

  it("should return empty result if person has no accounts", async () => {
    mockAccountsGateway.listByPersonId.mockResolvedValue([]);

    const result = await useCase.execute({ personId: "no-accounts" });

    expect(mockCardsGateway.listByAccountIds).toHaveBeenCalledWith([], 10, 1);
    expect(result.cards).toEqual([]);
    expect(result.pagination).toEqual({ itemsPerPage: 10, currentPage: 1 });
  });

  it("should return empty result if no cards are found", async () => {
    mockAccountsGateway.listByPersonId.mockResolvedValue([{ id: "acc-1" }] as any);
    mockCardsGateway.listByAccountIds.mockResolvedValue([]);

    const result = await useCase.execute({ personId: "person-xyz" });

    expect(result.cards).toEqual([]);
    expect(result.pagination).toEqual({ itemsPerPage: 10, currentPage: 1 });
  });
});
