import { Card } from "../../domain/cards/entity/cards.entity";
import { CardsGateway } from "../../domain/cards/gateway/cards.gateway";
import { Usecase } from "../usecase";

export type ListCardsByAccountInputDto = {
  accountId: string;
};

export type ListCardsByAccountOutputDto = Card[];

export class ListCardsByAccountUseCase implements Usecase<ListCardsByAccountInputDto, ListCardsByAccountOutputDto> {
  private constructor(private cardsGateway: CardsGateway) {}

  public static create(cardsGateway: CardsGateway) {
    return new ListCardsByAccountUseCase(cardsGateway);
  }

  async execute(input: ListCardsByAccountInputDto): Promise<ListCardsByAccountOutputDto> {
    const cards = await this.cardsGateway.listByAccountId(input.accountId);
    return cards;
  }
}
