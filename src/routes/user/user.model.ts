import { t } from "elysia";

// 用户相关的数据验证模式
export const loginSchema = t.Object({
	username: t.String({ minLength: 3, maxLength: 50 }),
	password: t.String({ minLength: 6, maxLength: 100 }),
	remember: t.Optional(t.Boolean()),
});

export const registerSchema = t.Object({
	username: t.String({ minLength: 3, maxLength: 50 }),
	password: t.String({ minLength: 6, maxLength: 100 }),
	email: t.Optional(t.String({ format: "email", maxLength: 100 })),
	nickname: t.Optional(t.String({ maxLength: 50 })),
});

export const updateProfileSchema = t.Object({
	nickname: t.Optional(t.String({ maxLength: 50 })),
	email: t.Optional(t.String({ format: "email", maxLength: 100 })),
	avatar: t.Optional(t.String({ maxLength: 255 })),
});
