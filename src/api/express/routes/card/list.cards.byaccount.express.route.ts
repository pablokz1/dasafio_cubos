import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { PrismaClient } from "@prisma/client";
import { CardsRepositoryPrisma } from "../../../../infra/repository/cards/cards.repository.prisma";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ListCardsByAccountUseCase } from "../../../../usecases/cards/list-cards.usecase";

export class ListCardsByAccountExpressRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listCardsByAccountUseCase: ListCardsByAccountUseCase
  ) { }

  static create() {
    const prisma = new PrismaClient();
    const cardsRepository = new CardsRepositoryPrisma(prisma);
    const usecase = ListCardsByAccountUseCase.create(cardsRepository);
    return new ListCardsByAccountExpressRoute(
      "/people/accounts/:accountId/cards",
      HttpMethod.GET,
      usecase
    );
  }

  public getHandler() {
    return async (req: Request, res: Response): Promise<void> => {
      const accountId = req.params.accountId;

      if (!accountId || accountId.trim() === "") {
        res.status(400).json({ message: "accountId is required" });
        return;
      }

      try {
        const cards = await this.listCardsByAccountUseCase.execute({ accountId });
        res.status(200).json(cards);
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  public getMiddlewares() {
    return [authMiddleware];
  }
}
