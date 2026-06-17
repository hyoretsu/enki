import postgres from "@prisma-next/postgres/runtime";
import type { Contract } from "../../out/contract";
import contractJson from "../../out/contract.json" with { type: "json" };

// Prisma Next connects lazily, so importing this module never opens a connection. Build-only
// steps that import the client transitively (e.g. `contract emit`, the OpenAPI export,
// type-checking) must not require a live DATABASE_URL. We therefore fall back to a harmless
// placeholder when it is absent and only fail when a query is actually issued.
const url = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";

export const db = postgres<Contract>({
	contractJson,
	url,
});

export type Db = typeof db;
