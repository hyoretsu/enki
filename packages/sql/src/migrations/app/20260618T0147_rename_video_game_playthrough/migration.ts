#!/usr/bin/env -S node
import {
	addForeignKey,
	addUnique,
	col,
	createIndex,
	dropTable,
	fn,
	lit,
	Migration,
	MigrationCLI,
	primaryKey,
} from "@prisma-next/postgres/migration";

// NOTE: Prisma Next has no table/column rename operation, so this contract rename plans as
// drop + create. Safe on a fresh database; on a populated one it drops existing rows.
export default class M extends Migration {
	override describe() {
		return {
			from: "sha256:3892b770e75e8a8fa77bb0558c0801250ff4a59259583034acb8d97ba9cc744e",
			to: "sha256:6350063979dd52ab2ef87a5d18154e2b4e01f5ca58745ac0f6f3a52cd7975c1d",
		};
	}

	override get operations() {
		return [
			dropTable("public", "userVideoGameRun"),
			dropTable("public", "videoGameRun"),
			this.createTable({
				columns: [
					col("id", "character(36)", { notNull: true }),
					col("playthroughId", "text", { notNull: true }),
					col("timeSpent", "int4"),
					col("userId", "text", { notNull: true }),
				],
				constraints: [primaryKey(["id"])],
				schema: "public",
				table: "userVideoGamePlaythrough",
			}),
			this.createTable({
				columns: [
					col("createdAt", "timestamptz", { default: fn("now()"), notNull: true }),
					col("id", "character(36)", { notNull: true }),
					col("name", "text", { default: lit(""), notNull: true }),
					col("updatedAt", "timestamptz", { default: fn("now()"), notNull: true }),
					col("videoGameId", "text", { notNull: true }),
				],
				constraints: [primaryKey(["id"])],
				schema: "public",
				table: "videoGamePlaythrough",
			}),
			addUnique("public", "videoGamePlaythrough", "videoGamePlaythrough_videoGameId_name_key", [
				"videoGameId",
				"name",
			]),
			createIndex("public", "userVideoGamePlaythrough", "userVideoGamePlaythrough_playthroughId_idx", [
				"playthroughId",
			]),
			createIndex("public", "videoGamePlaythrough", "videoGamePlaythrough_videoGameId_idx", ["videoGameId"]),
			addForeignKey("public", "userVideoGamePlaythrough", {
				columns: ["playthroughId"],
				name: "userVideoGamePlaythrough_playthroughId_fkey",
				references: { columns: ["id"], schema: "public", table: "videoGamePlaythrough" },
			}),
			addForeignKey("public", "videoGamePlaythrough", {
				columns: ["videoGameId"],
				name: "videoGamePlaythrough_videoGameId_fkey",
				references: { columns: ["id"], schema: "public", table: "videoGame" },
			}),
		];
	}
}

MigrationCLI.run(import.meta.url, M);
