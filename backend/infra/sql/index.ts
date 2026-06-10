import { db } from "./prisma/db";
import { PnMediaRepository, PnUsersRepository } from "./repositories";

export * from "./betterAuth";
export * from "./prisma/db";
export * from "./repositories";

export const mediaRepository = new PnMediaRepository(db);
export const usersRepository = new PnUsersRepository(db);
