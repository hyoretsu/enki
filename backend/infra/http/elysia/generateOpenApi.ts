import path from "node:path";
import { exit } from "node:process";
import { app } from "./server";

const schema = await (await app.handle(new Request("http://localhost/docs/json"))).json();

await Bun.write(path.resolve(__dirname, "../../generated/openapi.json"), JSON.stringify(schema, null, 4));

exit(0);
