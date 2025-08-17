# 末世机械师全栈项目开发规则

## 项目技术栈
- **运行时**: Bun (v1.2.15)
- **Web框架**: Elysia (v1.3.5)
- **数据库**: PostgreSQL + Drizzle ORM (v0.44.3)
- **类型验证**: TypeBox (v0.34.0) + drizzle-typebox (v0.3.3)
- **认证**: JWT + Bearer Token
- **代码格式化**: Biome
- **部署**: Docker + Vercel

## 项目结构
- `src/routes/`: 路由文件，每个模块一个文件
- `src/db/schema/`: 数据库表结构定义
- `src/db/comment/`: 数据库表注释
- `src/plugins/`: Elysia插件（认证、日志、Swagger等）
- `src/utils/`: 工具函数
- `scripts/schema/`: Schema生成和验证工具

## 开发规范

### 1. 类型和验证
1. 不需要返回类型
2. 不需要对参数进行额外验证，因为使用 typebox 提供的json自动验证
3. 构建类型,优先使用公共类型,不要忘记加上properties

```js
export const skillEffectModel = {
	// 统一查询参数 名称统一为 文件名 +Uno+ Query
	skillEffectUnoQuery: t.Object({
		...UnoQuery.properties
	}),
};
```

### 2. 路由规范
4. 每个路由的get('/')查询请求，有page就是分页查询，没有就是全部查询
5. 路由文件命名：`模块名.ts` 和 `模块名.model.ts`
6. 在route路由处理中,记得使用schema\index中导出的typebox类型

### 3. 数据库规范
7. src/db/schema-comments.ts 给数据库表添加注释
   1. 每个表添加注释 //还没实现
   2. 每个字段添加注释
8. 每次修改schema文件之后,都要修改注释文件夹(src/db/comment)
9. 注意观察src/db/schema/index 文件,一方面吧所有的关系和schema 导出,一边是吧收集schema 转化为typebox类型
10. src/db/schema/index 是统一导出,src/db/schema文件夹下面全是schema文件,每个文件都是一个表,这是orm
11. 每个shema文件不需要导出关系,在定义关系的时候导出,每个shema主要是变成typebox类型

### 4. 开发工具命令
- `bun run dev`: 开发模式启动
- `bun run dev:push`: 推送schema到开发数据库
- `bun run db:studio`: 启动Drizzle Studio
- `bun run generate:schema`: 生成schema类型
- `bun run watch:schema`: 监听schema变化
- `bun run check`: Biome代码检查和格式化

### 5. 环境配置
- 开发环境: PostgreSQL (localhost:5432/MechanicEndWorld)
- 生产环境: 使用环境变量配置
- 支持多环境配置 (.env.development, .env.production)
