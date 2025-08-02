import { CardsGateway } from "../../domain/cards/gateway/cards.gateway";
import { Usecase } from "../usecase";

export type ListCardsByAccountInputDto = {
  accountId: string;
};

export type ListCardsByAccountOutputDto = {
  id: string;
  type: string;
  number: string;
  cvv: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ListCardsByAccountUseCase implements Usecase<ListCardsByAccountInputDto, ListCardsByAccountOutputDto[]> {
  private constructor(private cardsGateway: CardsGateway) { }

  public static create(cardsGateway: CardsGateway) {
    return new ListCardsByAccountUseCase(cardsGateway);
  }

  async execute(input: ListCardsByAccountInputDto): Promise<ListCardsByAccountOutputDto[]> {
    const cards = await this.cardsGateway.listByAccountId(input.accountId);

    return cards.map(card => ({
      id: card.id,
      type: card.type,
      number: card.number,
      cvv: card.cvv,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    }));
  }
}
