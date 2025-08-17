import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

/**
 * Swagger 文档插件配置
 */
export const swaggerPlugin = new Elysia({ name: "swagger" }).use(
	swagger({
		documentation: {
			info: {
				title: "Mechanic End World API",
				version: "1.0.0",
				description: "末世机械师 API 文档",
			},
			tags: [
				{
					name: "Auth",
					description: "用户认证相关接口",
				},
				{
					name: "User",
					description: "用户管理相关接口",
				},
				{
					name: "Monster",
					description: "怪物管理相关接口",
				},
				{
					name: "Stage",
					description: "关卡管理相关接口",
				},
			],
		},
	}),
);
