import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { autoload } from "@pori15/esbuild-plugin-autoload";

/**
 * 构建配置接口
 */
interface BuildConfig {
	entrypoint: string;
	target: "bun" | "node";
	outdir: string;
	autoload: {
		directory: string;
		pattern: string[];
		debug: boolean;
	};
}
/**
 * 获取构建配置
 */
function getBuildConfig(): BuildConfig {
	const isProduction = process.env.NODE_ENV === "production";

	return {
		entrypoint: "./src/index.ts",
		target: "bun",
		outdir: "dist",
		autoload: {
			directory: `${process.cwd()}/src/routes`, // 使用绝对路径
			pattern: ["**/*.{ts,tsx}", "!**/*.model.ts"],
			debug: !isProduction, // 生产环境关闭调试
		},
	};
}

/**
 * 注入版本号到源代码
 */
function injectVersion() {
	console.log("📝 注入版本号到源代码...");

	try {
		// 读取package.json获取版本号
		const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));
		const version = packageJson.version;
		console.log(`📦 当前版本: ${version}`);

		// 读取index.ts文件
		const indexPath = join("src", "index.ts");
		let indexContent = readFileSync(indexPath, "utf-8");

		// 替换版本号
		const versionRegex = /const APP_VERSION = "[^"]*";/;
		const newVersionLine = `const APP_VERSION = "${version}";`;

		if (versionRegex.test(indexContent)) {
			indexContent = indexContent.replace(versionRegex, newVersionLine);
			console.log(`✅ 版本号已更新为: ${version}`);
		} else {
			console.warn("⚠️  未找到APP_VERSION定义，跳过版本号注入");
			return;
		}

		// 写回文件
		writeFileSync(indexPath, indexContent, "utf-8");
		console.log("✅ 版本号注入完成");
	} catch (error) {
		console.error("❌ 版本号注入失败:", error);
		// 不中断构建流程，继续执行
	}
}

/**
 * 使用 Bun.build 构建应用
 * 通过 esbuild-plugin-autoload 插件自动加载路由
 */
async function buildApp() {
	console.log("🔨 开始构建应用...");

	// 构建前注入版本号
	injectVersion();

	const config = getBuildConfig();
	const env = process.env.NODE_ENV || "development";
	console.log(`📋 使用环境: ${env}`);
	console.log(`📁 入口文件: ${config.entrypoint}`);
	console.log(`📂 输出目录: ${config.outdir}`);
	console.log(`🎯 目标平台: ${config.target}`);
	console.log(`📍 路由目录: ${config.autoload.directory}`);
	console.log(`🔍 匹配模式: ${config.autoload.pattern.join(", ")}`);

	try {
		const result = await Bun.build({
			entrypoints: [config.entrypoint],
			target: config.target,
			outdir: config.outdir,
			plugins: [
				autoload({
					directory: config.autoload.directory,
					pattern: config.autoload.pattern,
					debug: config.autoload.debug,
				}),
			],
		});

		if (result.success) {
			console.log("✅ 构建成功!");
			console.log(`📦 输出文件数量: ${result.outputs.length}`);
			result.outputs.forEach((output, index) => {
				console.log(`   ${index + 1}. ${output.path}`);
			});
		} else {
			console.error("❌ 构建失败:");
			result.logs.forEach((log) => {
				console.error(`   ${log.level}: ${log.message}`);
			});
			process.exit(1);
		}

		return result;
	} catch (error) {
		console.error("❌ 构建过程中发生错误:", error);
		process.exit(1);
	}
}

/**
 * 编译为可执行文件
 */
async function compileExecutable() {
	console.log("📦 开始编译可执行文件...");

	try {
		// 使用 Bun 编译为可执行文件
		const result =
			await Bun.$`bun build --compile dist/index.js --outfile dist.exe`;
		console.log("✅ 编译完成! 可执行文件: dist.exe");
		return result;
	} catch (error) {
		console.error("❌ 编译失败:", error);
		process.exit(1);
	}
}

/**
 * 主函数
 */
async function main() {
	const args = process.argv.slice(2);

	console.log("slice2", args);
	const shouldCompile = args.includes("--compile");

	console.log("🚀 启动构建流程...");
	console.log(`⚙️  编译模式: ${shouldCompile ? "启用" : "禁用"}`);

	// 执行构建
	const buildResult = await buildApp();

	// 如果指定了编译参数，则编译为可执行文件
	if (shouldCompile) {
		await compileExecutable();
	}

	console.log("🎉 构建流程完成!");
}

// 执行主函数
main().catch((error) => {
	console.error("💥 构建流程失败:", error);
	process.exit(1);
});
