import { eq } from "drizzle-orm";
import { db } from "../../db/connection.ts";
import { userSchema } from "../../db/schema/auth.ts";

import { commonRes, ErrorCode, errorRes } from "../../plugins/Res.ts";
import type { ElysiaApp } from "../../server.ts";
import { registerSchema } from "../user/user.model.ts";

export default (app: ElysiaApp) =>
	app
		.state("hashpasswd", "")
		// 用户注册
		.post(
			"/register",
			async ({ body, set, store: { hashpasswd } }) => {
				try {
					const { username, password, email, nickname } = body;
					// 1. 检查用户名是否已存在
					const exist = await db
						.select()
						.from(userSchema)
						.where(eq(userSchema.username, username));
					if (exist.length > 0) {
						set.status = 400;
						return errorRes(ErrorCode.USER_ALREADY_EXISTS, "用户名已存在");
					}
					// 检查邮箱是否已存在（如果提供了邮箱）
					if (email) {
						const exist = await db
							.select()
							.from(userSchema)
							.where(eq(userSchema.email, email));
						if (exist.length > 0) {
							set.status = 400;
							return errorRes(ErrorCode.USER_ALREADY_EXISTS, "邮箱已被使用");
						}
					}

					// 加密密码
					hashpasswd = await Bun.password.hash(password, {
						algorithm: "bcrypt",
					});

					// 创建用户
					const userIdArr = await db
						.insert(userSchema)
						.values({
							username,
							password: hashpasswd,
							email: email || null,
							nickname: nickname || username,
						})
						.returning({ userId: userSchema.id });

					const userId = String(userIdArr[0]);

					return commonRes(
						{
							user: userId,
						},
						200,
						"注册成功",
					);
				} catch (err) {
					console.error("注册失败:", err);
					set.status = 500;
					return errorRes(ErrorCode.INTERNAL_ERROR, "注册失败");
				}
			},
			{
				body: registerSchema,
				detail: {
					tags: ["Auth"],
					summary: "用户注册",
					description: "创建新用户账户",
				},
			},
		);
