import { createUserToken } from "@pori15/elysia-auth-drizzle";
import { eq } from "drizzle-orm";
import { envConfig } from "../../config/env.ts";
import { db } from "../../db/connection.ts";
import { tokenSchema, userSchema } from "../../db/schema/auth.ts";
import { commonRes, ErrorCode, errorRes } from "../../plugins/Res.ts";
import type { ElysiaApp } from "../../server.ts";
import { loginSchema } from "../user/user.model.ts";

export default (app: ElysiaApp) =>
	app
		.state("hashpasswd", "")
		// 用户登录
		.post(
			"/login",
			async ({ body, set, store: { hashpasswd } }) => {
				try {
					const { username, password } = body;
					// 查找用户
					const finduser = await db
						.select()
						.from(userSchema)
						.where(eq(userSchema.username, username))
						.limit(1);
					if (!finduser.length) {
						set.status = 401;
						return errorRes(ErrorCode.INVALID_PASSWORD, "用户名或密码错误");
					}
					const userData = finduser[0];

					if (!userData) {
						return;
					}
					// 检查用户状态
					if (userData.status !== 1) {
						set.status = 401;
						return errorRes(ErrorCode.ACCOUNT_DISABLED, "账户已被禁用");
					}
					//

					// 验证密码
					const isPasswordValid = await Bun.password.verify(
						password,
						userData.password,
					);
					if (!isPasswordValid) {
						set.status = 401;
						return errorRes(ErrorCode.INVALID_PASSWORD, "用户名或密码错误");
					}

					const { accessToken, refreshToken } = await createUserToken({
						db,
						usersSchema: userSchema,
						tokensSchema: tokenSchema,
					})(userData.id, {
						secret: envConfig.get("JWT_SECRET") || "tzd",
						accessTokenTime: `${body.remember ? 12 : 2}h`,
						refreshTokenTime: "7d",
					});
					return commonRes(
						{
							token: {
								accessToken,
								refreshToken,
							},
							user: finduser[0],
						},
						200,
						"登录成功",
					);
				} catch (err) {
					console.error("登录失败:", err);
					set.status = 500;
					return errorRes(ErrorCode.INTERNAL_ERROR, "登录失败");
				}
			},
			{
				body: loginSchema,
				detail: {
					tags: ["Auth"],
					summary: "用户登录",
					description: "用户名密码登录",
				},
			},
		);
