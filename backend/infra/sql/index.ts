import { db as database } from "sql";
import { PnMediaRepository, PnUsersRepository } from "./repositories";

export * from "sql";
export * from "./betterAuth";
export * from "./repositories";

export const mediaRepository = new PnMediaRepository(database);
export const usersRepository = new PnUsersRepository(database);
