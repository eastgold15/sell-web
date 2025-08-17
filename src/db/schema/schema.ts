import { relations } from "drizzle-orm";

import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	point,
	real,
	serial,
	smallint,
	text,
	varchar,
} from "drizzle-orm/pg-core";

// 技能效果表
export const skillEffectsSchema = pgTable("skill_effect", {
	id: serial("id").primaryKey(), // 效果ID
	buffName: varchar("buff_name", { length: 50 }).notNull(),
	maxFloor: integer("max_floor").notNull(),
	value: integer("value").notNull(), // 效果值
	negative: boolean("negative"), // 是否为负效果
	buffLv: integer("buffLv").notNull(), // buff的驱散等级
	description: text("description"), // 效果描述
});


