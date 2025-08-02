import { PrismaClient, CardType } from "@prisma/client";
import { CardsGateway } from "../../../domain/cards/gateway/cards.gateway";
import { Card } from "../../../domain/cards/entity/cards.entity";

export class CardsRepositoryPrisma implements CardsGateway {
  constructor(private readonly prisma: PrismaClient) { }

  async save(card: Card): Promise<void> {
    await this.prisma.card.create({
      data: {
        id: card.id,
        idAccount: card.accountId,
        type: card.type === "physical" ? CardType.PHYSICAL : CardType.VIRTUAL,
        number: card.number,
        cvv: card.cvv,
        isActive: true,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      },
    });
  }

  async listByAccountId(accountId: string): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({ where: { idAccount: accountId } });
    return cards.map(c =>
      Card.with({
        id: c.id,
        accountId: c.idAccount,
        type: c.type === CardType.PHYSICAL ? "physical" : "virtual",
        number: c.number,
        cvv: c.cvv,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })
    );
  }

  async listByAccountIds(accountIds: string[], itemsPerPage: number, currentPage: number): Promise<Card[]> {
    const skip = (currentPage - 1) * itemsPerPage;
    const cards = await this.prisma.card.findMany({
      where: { idAccount: { in: accountIds } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: itemsPerPage,
    });

    return cards.map(c => Card.with({
      id: c.id,
      accountId: c.idAccount,
      type: c.type as 'physical' | 'virtual',
      number: c.number,
      cvv: c.cvv,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async findPhysicalCardByAccountId(accountId: string): Promise<Card | null> {
    const card = await this.prisma.card.findFirst({
      where: { idAccount: accountId, type: CardType.PHYSICAL },
    });

    if (!card) return null;

    return Card.with({
      id: card.id,
      accountId: card.idAccount,
      type: "physical",
      number: card.number,
      cvv: card.cvv,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    });
  }
}
