import { Card, CardProps } from "../../../../domain/cards/entity/cards.entity";

describe("Card Entity", () => {
    const fixedDate = new Date("2025-01-01T12:00:00Z");
    const mockUuid = "mock-uuid-1234";

    beforeAll(() => {
        global.crypto = {
            randomUUID: () => mockUuid,
        } as unknown as Crypto;
    });

    describe("create()", () => {
        it("should create a Card instance with correct default values", () => {
            const accountId = "acc-123";
            const type = "physical" as const;
            const number = "1234567890123456";
            const cvv = "123";

            jest.useFakeTimers().setSystemTime(fixedDate);

            const card = Card.create(accountId, type, number, cvv);

            expect(card).toBeInstanceOf(Card);
            expect(card.accountId).toBe(accountId);
            expect(card.type).toBe(type);
            expect(card.number).toBe(number);
            expect(card.cvv).toBe(cvv);
            expect(card.createdAt).toEqual(fixedDate);
            expect(card.updatedAt).toEqual(fixedDate);
            expect(card.id).toBe(mockUuid);

            jest.useRealTimers();
        });
    });

    describe("with()", () => {
        it("should create a Card instance from props", () => {
            const props: CardProps = {
                id: mockUuid,
                accountId: "acc-456",
                type: "virtual",
                number: "9876543210987654",
                cvv: "321",
                createdAt: fixedDate,
                updatedAt: fixedDate,
            };

            const card = Card.with(props);

            expect(card).toBeInstanceOf(Card);
            expect(card.accountId).toBe(props.accountId);
            expect(card.type).toBe(props.type);
            expect(card.number).toBe(props.number);
            expect(card.cvv).toBe(props.cvv);
            expect(card.createdAt).toEqual(props.createdAt);
            expect(card.updatedAt).toEqual(props.updatedAt);
            expect(card.id).toBe(props.id);
        });
    });

    describe("getters", () => {
        it("should return the correct property values", () => {
            const props: CardProps = {
                id: mockUuid,
                accountId: "acc-789",
                type: "physical",
                number: "1111222233334444",
                cvv: "999",
                createdAt: fixedDate,
                updatedAt: fixedDate,
            };

            const card = Card.with(props);

            expect(card.accountId).toBe(props.accountId);
            expect(card.type).toBe(props.type);
            expect(card.number).toBe(props.number);
            expect(card.cvv).toBe(props.cvv);
            expect(card.createdAt).toEqual(props.createdAt);
            expect(card.updatedAt).toEqual(props.updatedAt);
            expect(card.id).toBe(props.id);
        });
    });
});
