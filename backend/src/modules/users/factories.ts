import { usersRepository } from "@/shared/infra/sql";
import { GetStatistics } from "./useCases";

export const buildGetStatistics = (): GetStatistics => new GetStatistics(usersRepository);
