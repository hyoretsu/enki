import { MediaController } from "@/modules/media";
import { UsersController } from "@/modules/users";
import { app } from "@/shared/infra/elysia";

export const server = app.use(MediaController).use(UsersController);
