import { Elysia } from "elysia";

// const log = createPinoLogger();
// 全局错误处理中间件


export const err_handler = new Elysia()
	.onError(({ error, path }) => {
		console.groupCollapsed(`🔴 ${path} 路由错误`);
		console.trace(error); // 显示调用栈
		console.groupEnd();
	})
	.as("global");
