# Elysia Start

一个基于 Elysia 框架的现代化 Web API 启动模板，集成了完整的开发工具链和最佳实践。

## ✨ 特性

- 🚀 **高性能**: 基于 Bun 运行时和 Elysia 框架
- 🔒 **类型安全**: 完整的 TypeScript 支持和 TypeBox 验证
- 🗄️ **数据库集成**: PostgreSQL + Drizzle ORM
- 🔐 **身份认证**: JWT + Bearer Token 认证系统
- 📚 **API 文档**: 自动生成的 Swagger 文档
- 🐳 **容器化**: Docker 开发和生产环境支持
- 🔧 **开发工具**: 热重载、代码格式化、Schema 生成
- 📦 **自动加载**: 路由自动发现和加载

## 🛠️ 技术栈

- **运行时**: [Bun](https://bun.sh/) (v1.2.15+)
- **Web 框架**: [Elysia](https://elysiajs.com/) (v1.3.5+)
- **数据库**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) (v0.44.3+)
- **类型验证**: [TypeBox](https://github.com/sinclairzx81/typebox) (v0.34.0+)
- **认证**: JWT + Bearer Token
- **代码格式化**: [Biome](https://biomejs.dev/)
- **部署**: Docker + Vercel

## 📁 项目结构

```
elysia-start/
├── .container/                 # 容器配置
│   ├── dev/                   # 开发环境配置
│   │   ├── docker-compose.yml # 开发数据库
│   │   └── drizzle-dev.config.ts
│   └── prod/                  # 生产环境配置
│       ├── Dockerfile
│       └── docker-compose.prod.yml
├── scripts/                   # 构建和工具脚本
│   ├── build.ts              # 构建脚本
│   └── schema/                # Schema 生成工具
├── src/
│   ├── config/                # 配置文件
│   │   └── env.ts            # 环境变量管理
│   ├── db/                    # 数据库相关
│   │   ├── connection.ts     # 数据库连接
│   │   ├── schema/           # 数据表结构
│   │   └── comment/          # 数据表注释
│   ├── plugins/               # Elysia 插件
│   │   ├── auth.ts           # 认证插件
│   │   ├── logger.ts         # 日志插件
│   │   └── swagger.ts        # API 文档插件
│   ├── routes/                # 路由文件
│   │   ├── auth/             # 认证相关路由
│   │   ├── user/             # 用户管理路由
│   │   └── health.ts         # 健康检查
│   ├── utils/                 # 工具函数
│   ├── index.ts              # 应用入口
│   └── server.ts             # 服务器配置
├── .env                       # 环境变量
├── biome.json                # 代码格式化配置
├── package.json
└── tsconfig.json
```

## 🚀 快速开始

### 环境要求

- [Bun](https://bun.sh/) >= 1.2.15
- [PostgreSQL](https://www.postgresql.org/) >= 15
- [Docker](https://www.docker.com/) (可选，用于容器化开发)

### 安装依赖

```bash
# 克隆项目
git clone <your-repo-url>
cd elysia-start

# 安装依赖
bun install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库连接：
```env
# 应用配置
APP_NAME=elysia-start
APP_HOST=http://localhost
APP_PORT=9003
APP_URL=$APP_HOST:$APP_PORT

# 数据库配置
DATABASE_URL=postgres://app_user:app_pass@localhost:5432/elysia_start

# JWT 密钥
JWT_SECRET=your-jwt-secret-key
COOKIE_SECRET=your-cookie-secret-key

# 跨域配置
CORS_ORIGIN=http://localhost:9002
```

### 数据库设置

#### 方式一：使用 Docker（推荐）

```bash
# 启动开发数据库
bun run docker
```

#### 方式二：本地 PostgreSQL

1. 安装并启动 PostgreSQL
2. 创建数据库：
```sql
CREATE DATABASE elysia_start;
CREATE USER app_user WITH PASSWORD 'app_pass';
GRANT ALL PRIVILEGES ON DATABASE elysia_start TO app_user;
```

### 数据库迁移

```bash
# 生成 Schema 类型
bun run generate:schema

# 推送 Schema 到数据库
bun run dev:push
```

### 启动开发服务器

```bash
# 启动开发服务器（热重载）
bun run dev
```

服务器将在 `http://localhost:9003` 启动

## 📖 API 文档

启动服务器后，访问以下地址查看 API 文档：

- Swagger UI: `http://localhost:9003/swagger`

## 🔧 开发命令

### 基础命令

```bash
# 开发模式启动（热重载）
bun run dev

# 生产模式启动
bun run start

# 构建项目
bun run build

# 代码检查和格式化
bun run check
```

### 数据库命令

```bash
# 生成 Schema 类型
bun run generate:schema

# 监听 Schema 变化
bun run watch:schema

# 验证 Schema
bun run validate:schema

# 推送 Schema 到开发数据库
bun run dev:push

# 推送 Schema 到生产数据库
bun run prod:push

# 启动 Drizzle Studio
bun run db:studio

# 添加数据库表注释
bun run db:comments
```

### Docker 命令

```bash
# 启动开发环境数据库
bun run docker

# 构建生产镜像
bun run docker:build:prod
```

### 版本发布

```bash
# 生成变更日志
bun run release

# 发布补丁版本
bun run release:patch

# 发布次要版本
bun run release:minor

# 发布主要版本
bun run release:major
```

## 🏗️ 开发指南

### 添加新路由

1. 在 `src/routes/` 目录下创建路由文件
2. 路由会自动被发现和加载
3. 使用 TypeBox 定义请求/响应类型

示例：
```typescript
// src/routes/example.ts
import { Elysia, t } from 'elysia';

export const exampleRoute = new Elysia({ prefix: '/api/example' })
  .get('/', () => ({ message: 'Hello World' }), {
    detail: {
      tags: ['Example'],
      summary: '示例接口'
    }
  })
  .post('/', ({ body }) => ({ received: body }), {
    body: t.Object({
      name: t.String(),
      age: t.Number()
    }),
    detail: {
      tags: ['Example'],
      summary: '创建示例'
    }
  });
```

### 数据库 Schema

1. 在 `src/db/schema/` 目录下定义表结构
2. 在 `src/db/comment/` 目录下添加表注释
3. 运行 `bun run generate:schema` 生成类型
4. 运行 `bun run dev:push` 同步到数据库

### 认证系统

项目集成了基于 JWT 的认证系统：

- 注册：`POST /register`
- 登录：`POST /login`
- 受保护的路由需要在请求头中包含 `Authorization: Bearer <token>`

## 🐳 部署

### Docker 部署

```bash
# 构建生产镜像
docker build -f .container/prod/Dockerfile -t elysia-start .

# 运行容器
docker run -p 3000:3000 elysia-start
```

### 环境变量

生产环境需要设置以下环境变量：

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
COOKIE_SECRET=your-production-cookie-secret
APP_PORT=3000
```

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Elysia](https://elysiajs.com/) - 快速且类型安全的 Web 框架
- [Bun](https://bun.sh/) - 快速的 JavaScript 运行时
- [Drizzle ORM](https://orm.drizzle.team/) - 类型安全的 ORM
- [TypeBox](https://github.com/sinclairzx81/typebox) - JSON Schema 类型构建器