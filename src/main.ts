import { ApiExpress } from "./api/express/api.express";
import { CreatePeopleRoute } from "./api/express/routes/people/create.people.express.route";
import { ListPeopleRoute } from "./api/express/routes/people/list.people.express.route";
import { LoginExpressRoute } from "./api/express/routes/auth/login.express.route";
import { PeopleRepositoryPrisma } from "./infra/repository/people/people.repository.prisma";
import { prisma } from "./packege/prisma/prisma";
import { CreateAccountExpressRoute } from "./api/express/routes/accounts/create.account.express.route";
import { ListPeopleUsecase } from "./usecases/people/list-people.usecase";
import dotenv from 'dotenv';
import { ListAccountsByPeopleExpressRoute } from "./api/express/routes/accounts/list.account.bypeople.express.route";
import { CreateCardExpressRoute } from "./api/express/routes/card/create.card.express.route";
import { ListCardsByAccountExpressRoute } from "./api/express/routes/card/list.cards.byaccount.express.route";
import { ListCardsByPeopleExpressRoute } from "./api/express/routes/card/list.cards.bypeople.express.route";
import { CreateTransactionExpressRoute } from "./api/express/routes/transaction/create.transaction.express.route";
import { CreateInternalTransactionExpressRoute } from "./api/express/routes/transaction/create.transaction.internal.express.route";
import { ListTransactionsByExpressAccountRoute } from "./api/express/routes/transaction/liste.transactions.byaccount.express.route";
import { GetBalanceAccountExpressRoute } from "./api/express/routes/accounts/get-balance.account.express.route";

dotenv.config();

function main() {

    const aRepository = PeopleRepositoryPrisma.create(prisma);

    const listPeopleUsecase = ListPeopleUsecase.create(aRepository);

    const createRoute = CreatePeopleRoute.create();
    const listRoute = ListPeopleRoute.create(listPeopleUsecase);

    const loginRoute = LoginExpressRoute.create();

    const createAccount = CreateAccountExpressRoute.create();
    const listAccountByPeople = ListAccountsByPeopleExpressRoute.create();
    const getBalanceAccount = GetBalanceAccountExpressRoute.create();

    const creatCard = CreateCardExpressRoute.create();
    const listCardsByAccount = ListCardsByAccountExpressRoute.create();
    const listCardsByPeople = ListCardsByPeopleExpressRoute.create();

    const createTransaction = CreateTransactionExpressRoute.create();
    const createTransactionInternal = CreateInternalTransactionExpressRoute.create();
    const listTransactionByAccount = ListTransactionsByExpressAccountRoute.create();

    const api = ApiExpress.create([
        createRoute,
        listRoute,
        loginRoute,
        createAccount,
        listAccountByPeople,
        getBalanceAccount,
        creatCard,
        listCardsByAccount,
        listCardsByPeople,
        createTransaction,
        createTransactionInternal,
        listTransactionByAccount,
    ]);

    const port = 8000;
    api.start(port);
}

main();