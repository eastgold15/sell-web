import { commonRes } from "../plugins/Res.ts";
import type { ElysiaApp } from "../server.ts";
import { performHealthCheck } from "../utils/healthyCheck.ts";

export default (app: ElysiaApp) =>
	app.get(
		"/",
		async () => {
			try {
				const dbResult = await performHealthCheck();

				return commonRes(
					{
						status: "healthy",
						database: dbResult.success ? "connected" : "disconnected",
						timestamp: new Date().toISOString(),
						uptime: process.uptime(),
					},
					200,
					"服务健康检查通过",
				);
			} catch (error) {
				return commonRes(
					{
						status: "unhealthy",
						database: "disconnected",
						error: (error as Error).message,
						timestamp: new Date().toISOString(),
					},
					503,
					"服务健康检查失败",
				);
			}
		},
		{
			detail: {
				tags: ["System"],
				summary: "健康检查",
				description: "检查服务整体健康状态，包括数据库连接",
			},
		},
	);
