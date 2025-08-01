import { ApiExpress } from "./infra/api/express/api.express";
import { CreatePeopleRoute } from "./infra/api/express/routes/people/create.people.express.route";
import { ListPeopleRoute } from "./infra/api/express/routes/people/list.people.express.route";
import { PeopleRepositoryPrisma } from "./infra/repository/people/people.repository.prisma";
import { prisma } from "./packege/prisma/prisma";
import { CreatePeopleUsecase } from "./usecases/people/create-people/create-people.usecae";
import { ListPeopleUsecase } from "./usecases/people/list-people/list-people.usecase";

 function main() {
    const aRepository = PeopleRepositoryPrisma.create(prisma);

    const createPeopleUsecase = CreatePeopleUsecase.create(aRepository);
    const listPeopleUsecase = ListPeopleUsecase.create(aRepository);

    const createRoute = CreatePeopleRoute.create(createPeopleUsecase);
    const listRoute = ListPeopleRoute.create(listPeopleUsecase);

    const api = ApiExpress.create([
        createRoute,
        listRoute,
    ]);
    
    const port = 8000;
    api.start(port);
 }

 main();