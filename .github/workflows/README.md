# GitHub Actions 工作流说明

## 构建 Docker 镜像工作流 (build-image.yml)

这个工作流用于构建 Docker 镜像并推送到阿里云容器镜像服务 (ACR)。

### 触发方式

1. **自动触发**：当代码推送到 `main` 或 `master` 分支时
2. **手动触发**：在 GitHub Actions 页面手动运行
3. **工作流调用**：被其他工作流调用

### 手动构建功能

当手动触发工作流时，可以指定以下参数：

#### 🏷️ 版本号 (version)
- **描述**：手动指定版本号
- **示例**：`v1.0.0`, `1.2.3`, `2.0.0-beta`
- **可选**：是
- **默认值**：空（使用自动生成的标签）

#### 🔖 标签后缀 (tag_suffix)
- **描述**：为版本号添加后缀
- **示例**：`beta`, `alpha`, `rc1`, `hotfix`
- **可选**：是
- **默认值**：空

### 标签生成规则

工作流会根据不同情况生成以下标签：

1. **手动指定版本**：
   - `{version}` (如果指定了版本号)
   - `{version}-{suffix}` (如果同时指定了版本号和后缀)

2. **Git 标签版本**：
   - 自动从 Git 标签提取版本号

3. **通用标签**：
   - `latest` (总是生成)
   - `{branch}-{sha}-{timestamp}` (分支+提交哈希+时间戳)

4. **手动构建特殊标签**：
   - `manual-{branch}-{timestamp}` (仅在手动触发且未指定版本时)

### 使用示例

#### 场景 1：发布正式版本
```
版本号: v1.0.0
标签后缀: (空)
生成标签: v1.0.0, latest, main-abc1234-20241201-143022
```

#### 场景 2：发布测试版本
```
版本号: v1.1.0
标签后缀: beta
生成标签: v1.1.0-beta, latest, main-def5678-20241201-143022
```

#### 场景 3：快速测试构建
```
版本号: (空)
标签后缀: (空)
生成标签: latest, main-ghi9012-20241201-143022, manual-main-20241201-143022
```

### 镜像仓库信息

- **仓库地址**：`registry.cn-chengdu.aliyuncs.com`
- **镜像名称**：`docker-tzd/mechanicendworld`
- **完整地址**：`registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld`

### 拉取镜像示例

```bash
# 拉取最新版本
docker pull registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld:latest

# 拉取指定版本
docker pull registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld:v1.0.0

# 拉取测试版本
docker pull registry.cn-chengdu.aliyuncs.com/docker-tzd/mechanicendworld:v1.1.0-beta
```

### 环境变量配置

需要在 GitHub 仓库的 Secrets 中配置以下变量：

- `ALIYUN_REGISTRY_USERNAME`：阿里云容器镜像服务用户名
- `ALIYUN_REGISTRY_PASSWORD`：阿里云容器镜像服务密码

### 注意事项

1. 版本号建议遵循语义化版本规范 (Semantic Versioning)
2. 标签后缀通常用于标识版本类型（如 alpha、beta、rc 等）
3. 每次构建都会生成 `latest` 标签，指向最新构建的镜像
4. 工作流会显示详细的构建信息和生成的标签列表