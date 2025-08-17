/**
 * 自动生成的数据库 Schema 文件
 * 请勿手动修改此文件，运行 `bun run generate:schema` 重新生成
 * 生成时间: 2025-08-12T02:19:33.288Z
 */

import { tokenSchema, userSchema } from "./auth.ts";
import {
	basicInstanceSchema,
	enemyerSchema,
	itemSchema,
	otherJsonSchema,
	playerSchema,
	raceSchema,
	skillEffectsSchema,
	stageSchema,
	waveEnemyerSchema,
	waveSchema,
	weaponInfoSchema,
} from "./schema.ts";
import { shopInfoSchema, shopPoolsSchema, shopTiersSchema } from "./shop.ts";

export const dbSchema = {
	userSchema,
	tokenSchema,
	skillEffectsSchema,
	raceSchema,
	basicInstanceSchema,
	playerSchema,
	enemyerSchema,
	itemSchema,
	stageSchema,
	waveSchema,
	waveEnemyerSchema,
	weaponInfoSchema,
	otherJsonSchema,
	shopTiersSchema,
	shopPoolsSchema,
	shopInfoSchema,
};

/**
 * 数据库 Schema 类型
 */
export type DbSchema = typeof dbSchema;

/**
 * 所有表的名称列表
 */
export const tableNames = [
	"userSchema",
	"tokenSchema",
	"skillEffectsSchema",
	"raceSchema",
	"basicInstanceSchema",
	"playerSchema",
	"enemyerSchema",
	"itemSchema",
	"stageSchema",
	"waveSchema",
	"waveEnemyerSchema",
	"weaponInfoSchema",
	"otherJsonSchema",
	"shopTiersSchema",
	"shopPoolsSchema",
	"shopInfoSchema",
] as const;

/**
 * 表名称类型
 */
export type TableName = (typeof tableNames)[number];
