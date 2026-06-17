import postgres from "@prisma-next/postgres/runtime";
import type { Contract } from "../out/contract";
import contractJson from "../out/contract.json" with { type: "json" };

// Build-only steps must not require a live DATABASE_URL.
const url = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";

export const db = postgres<Contract>({
	contractJson,
	url,
});

export type Db = typeof db;
