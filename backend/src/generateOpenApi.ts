import path from "node:path";
import { exit } from "node:process";
import { server } from "@/server";

const schema = await (await server.handle(new Request("http://localhost/docs/json"))).json();

await Bun.write(path.resolve(__dirname, "../out/openapi.json"), JSON.stringify(schema, null, 4));

exit(0);
