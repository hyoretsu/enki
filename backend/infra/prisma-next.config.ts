import { defineConfig } from "@prisma-next/postgres/config";

export default defineConfig({
	contract: "./sql/prisma/contract.prisma",
	db: {
		connection: process.env.DATABASE_URL,
	},
	migrations: {
		dir: "./sql/migrations",
	},
});
