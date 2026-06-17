import { server } from "@/server";

server.listen(process.env.PORT || 3333);

console.log(`🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`);
