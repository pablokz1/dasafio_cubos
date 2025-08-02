import { ApiExpress } from "./api/express/api.express";
import { CreatePeopleRoute } from "./api/express/routes/people/create.people.express.route";
import { ListPeopleRoute } from "./api/express/routes/people/list.people.express.route";
import { LoginExpressRoute } from "./api/express/routes/auth/login.express.route";
import { PeopleRepositoryPrisma } from "./infra/repository/people/people.repository.prisma";
import { prisma } from "./packege/prisma/prisma";
import { ListPeopleUsecase } from "./usecases/people/list-people/list-people.usecase";
import { CreateAccountExpressRoute } from "./api/express/routes/accounts/create.account.express.route";
import dotenv from 'dotenv';

dotenv.config();

function main() {

    const aRepository = PeopleRepositoryPrisma.create(prisma);

    const listPeopleUsecase = ListPeopleUsecase.create(aRepository);

    const createRoute = CreatePeopleRoute.create();
    const listRoute = ListPeopleRoute.create(listPeopleUsecase);

    const loginRoute = LoginExpressRoute.create();

    const createAccount = CreateAccountExpressRoute.create();

    const api = ApiExpress.create([
        createRoute,
        listRoute,
        loginRoute,
        createAccount,
    ]);

    const port = 8000;
    api.start(port);
}

main();