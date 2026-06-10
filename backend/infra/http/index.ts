import { app } from "./elysia/server";

app.listen(process.env.PORT || 3333);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
