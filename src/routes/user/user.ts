import { eq } from "drizzle-orm";
import { t } from "elysia";
import { db } from "../../db/connection.ts";
import { userSchema } from "../../db/schema/auth.ts";

import { commonRes, ErrorCode, errorRes } from "../../plugins/Res.ts";
import type { ElysiaApp } from "../../server.ts";
import { updateProfileSchema } from "./user.model.ts";

export default (app: ElysiaApp) =>
	app

		// 获取当前用户信息
		.get(
			"/profile",
			({ connectedUser }) => {
				return commonRes(connectedUser, 200, "获取用户信息成功");
			},
			{
				detail: {
					tags: ["User"],
					summary: "获取用户信息",
					description: "获取当前登录用户的详细信息",
				},
			},
		)
		// 更新用户信息
		.put(
			"/profile",
			async ({ body, connectedUser, set }) => {
				try {
					const { nickname, email, avatar } = body;

					// 如果更新邮箱，检查是否已被其他用户使用
					if (email && email !== connectedUser?.email) {
						const existingEmail = await db
							.select({ id: userSchema.id })
							.from(userSchema)
							.where(eq(userSchema.email, email))
							.limit(1);

						if (
							existingEmail.length > 0 &&
							existingEmail[0]?.id !== connectedUser?.id
						) {
							set.status = 400;
							return errorRes(
								ErrorCode.USER_ALREADY_EXISTS,
								"邮箱已被其他用户使用",
							);
						}
					}

					// 更新用户信息
					await db
						.update(userSchema)
						.set({
							nickname: nickname || connectedUser?.nickname,
							email: email || connectedUser?.email,
							avatar: avatar || connectedUser?.avatar,
						})
						.where(eq(userSchema.id, connectedUser?.id ?? "0"));

					// 获取更新后的用户信息
					const updatedUser = await db
						.select({
							id: userSchema.id,
							username: userSchema.username,
							email: userSchema.email,
							nickname: userSchema.nickname,
							avatar: userSchema.avatar,
							status: userSchema.status,
							created_at: userSchema.createdAt,
							updated_at: userSchema.updatedAt,
						})
						.from(userSchema)
						.where(eq(userSchema.id, connectedUser?.id ?? "0"))
						.limit(1);

					return commonRes(updatedUser[0], 200, "更新用户信息成功");
				} catch (err) {
					console.error("更新用户信息失败:", err);
					set.status = 500;
					return errorRes(ErrorCode.INTERNAL_ERROR, "更新用户信息失败");
				}
			},
			{
				body: updateProfileSchema,
				detail: {
					tags: ["User"],
					summary: "更新用户信息",
					description: "更新当前用户的个人信息",
				},
			},
		)
		// 修改密码
		.put(
			"/password",
			async ({ body, connectedUser, set }) => {
				try {
					const { currentPassword, newPassword } = body;

					// 获取用户当前密码
					const userData = await db
						.select({ password: userSchema.password })
						.from(userSchema)
						.where(eq(userSchema.id, connectedUser?.id ?? "0"))
						.limit(1);

					if (!userData.length) {
						set.status = 404;
						return errorRes(ErrorCode.USER_NOT_FOUND, "用户不存在");
					}

					// 验证当前密码
					const isCurrentPasswordValid = await Bun.password.verify(
						currentPassword,
						userData[0]?.password || "",
					);

					if (!isCurrentPasswordValid) {
						set.status = 400;
						return errorRes(ErrorCode.INVALID_PASSWORD, "当前密码错误");
					}

					// 加密新密码
					const hashedNewPassword = await Bun.password.hash(newPassword, {
						algorithm: "bcrypt",
					});

					// 更新密码
					await db
						.update(userSchema)
						.set({ password: hashedNewPassword })
						.where(eq(userSchema.id, connectedUser?.id ?? "0"));

					return commonRes(null, 200, "密码修改成功");
				} catch (err) {
					console.error("修改密码失败:", err);
					set.status = 500;
					return errorRes(ErrorCode.INTERNAL_ERROR, "修改密码失败");
				}
			},
			{
				body: t.Object({
					currentPassword: t.String({ minLength: 6, maxLength: 100 }),
					newPassword: t.String({ minLength: 6, maxLength: 100 }),
				}),
				detail: {
					tags: ["User"],
					summary: "修改密码",
					description: "修改当前用户的登录密码",
				},
			},
		);
