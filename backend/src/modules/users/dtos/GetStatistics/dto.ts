import { Category } from "@/shared/types";
import { t } from "elysia";

export const GetStatisticsQuery = t.Object({
	categories: t.Optional(t.Array(t.Enum(Category))),
});
export type GetStatisticsQuery = typeof GetStatisticsQuery.static;

export const GetStatisticsReturn = t.Object({
	totalTime: t.Array(t.Integer()),
});
export type GetStatisticsReturn = typeof GetStatisticsReturn.static;
