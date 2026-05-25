# LeaseLensAI

LeaseLensAI 是一个商业空间分析系统，包含：

- 图片上传与多智能体流式分析
- 面向经营决策的空间平面图
- 基于 Google Places 的周边真实市场地图
- 基于 Docker 的本地开发与部署流程

## 环境要求

- 安装 Docker Desktop 或 Docker Engine，并带有 Compose 支持
- 从 `.env.example` 复制一份 `.env`
- 有可用的 LLM API Key
- 有可用的 Google Places API (New) Key

`.env` 中至少需要填写：

- `LEASENS_LLM_API_KEY`
- `LEASENS_GOOGLE_PLACES_API_KEY`

当前项目默认接入的 LLM 为智谱 GLM 系列模型。部署时请提供可用的 GLM API Key，并在 `.env` 中按项目要求配置对应模型名称。

`LEASENS_GOOGLE_PLACES_API_KEY` 申请入口：

- Google Maps Platform 控制台：<https://console.cloud.google.com/google/maps-apis/start>
- Places API (New) 获取 API Key 官方说明：<https://developers.google.com/maps/documentation/places/web-service/get-api-key>

申请时需要完成：

- 创建或选择一个 Google Cloud 项目
- 绑定 Billing Account
- 启用 `Places API (New)`
- 创建 API Key，并限制为仅允许 `Places API (New)`

## 推荐的 GitHub 部署方式

给其他开发者或跨平台本地部署时，推荐使用便携版 Compose 配置：

```bash
cp .env.example .env
docker compose -f docker-compose.portable.yml up --build -d
```

启动后访问：

```text
http://localhost:8080/
```

`docker-compose.portable.yml` 的特点：

- 使用标准 Docker bridge 网络
- `api -> db` 通过 `db:5432`
- `api -> redis` 通过 `redis:6379`
- `nginx -> api` 通过 `api:8000`
- 不依赖 `network_mode: host`

## 当前仓库中的默认 Compose

仓库根目录的 `docker-compose.yml` 是当前维护者机器专用的本地配置。

保留它的原因是：

- 它适配当前 Linux 宿主机
- 它适配本机代理与网络约束

除非你明确知道自己要复用这套拓扑，否则不要把它当作 GitHub 用户的默认启动方式。

## Windows 说明

Windows 环境建议使用 Docker Desktop，并保持在 Linux containers 模式下运行。

推荐启动方式：

```bash
docker compose -f docker-compose.portable.yml up --build -d
```

不要默认使用仓库中的 `docker-compose.yml`，因为那份配置偏向当前维护者本机环境。

## 代理说明

如果你的网络环境需要 HTTP 代理，请在 `.env` 中按需设置：

- `DOCKER_BUILD_HTTP_PROXY`
- `DOCKER_BUILD_HTTPS_PROXY`
- `DOCKER_RUNTIME_HTTP_PROXY`
- `DOCKER_RUNTIME_HTTPS_PROXY`

在 Docker Desktop 环境中，如果代理运行在宿主机上，通常应使用
`host.docker.internal` 作为容器访问宿主机的地址。

## 验证命令

健康检查：

```bash
curl -i http://127.0.0.1:8080/api/v1/health
```

地址搜索检查：

```bash
curl -i -X POST http://127.0.0.1:8080/api/locations/autocomplete \
  -H 'Content-Type: application/json' \
  --data '{"input":"Shanghai","sessionToken":"session-token-1"}'
```

预期结果：

- 健康检查返回 `200`
- 地址搜索返回 `200`，并且响应体中包含 `predictions`

## 常见问题

如果镜像构建失败：

- 检查 Docker 代理变量是否正确
- 检查 Docker 是否能访问 Docker Hub

如果地址搜索返回 `503`：

- 确认 `LEASENS_GOOGLE_PLACES_API_KEY` 已配置
- 确认 Google Places API (New) 已启用
- 确认运行时代理配置与你的机器网络环境一致
# LeaselensAI
