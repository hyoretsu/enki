import { PnMediaRepository, PnUsersRepository } from "@/shared/repositories/prisma";
import { db } from "sql";

export { db };

export const mediaRepository = new PnMediaRepository(db);
export const usersRepository = new PnUsersRepository(db);
