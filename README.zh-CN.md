[English](README.md) | [简体中文](README.zh-CN.md)

# FrontMatter

**FrontMatter 是一个面向新加坡的小微商户商铺租赁尽调系统。**

它帮助创业者在签约前判断一个零售或餐饮铺位，是否在运营条件、商业合理性和财务可行性上站得住。

FrontMatter 结合了：

- 铺位图片分析
- 新加坡限定的地址校验与周边商业观察
- 结构化租约与经营输入
- 折现现金流分析
- 压力测试
- 候选点对比

FrontMatter 是一个**决策支持工具**，不是“保证成功”的预测器。

## 项目一句话

**FrontMatter 把新加坡商铺租约，转化为结构化的 go / no-go 商业决策。**

## 仓库内容

- `frontend/` — Next.js 前端
- `backend/` — FastAPI 后端、评分与经济模型、测试
- `scripts/` — 本地启动、停止、重启 bash 脚本
- `docs/` — 面向比赛组委会的补充文档
- `FrontMatter.md` — 产品与技术规格说明

## 当前运行方式

这个仓库现在**不再依赖 Docker**。

FrontMatter 改为标准本地开发栈：

- 前端：Next.js dev server
- 后端：FastAPI + Uvicorn
- 数据库：本机 PostgreSQL
- 缓存 / 会话：本机 Redis

## 前置依赖

请在本机手动安装：

- Python `3.11`
- Node.js `20`
- PostgreSQL `16+`
- Redis `7+`

Ubuntu 可参考：

```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip nodejs npm postgresql redis-server
```

如果你使用 `nvm`，建议明确安装 Node.js 20：

```bash
nvm install 20
nvm use 20
```

## 所需账号与 API Key

你需要准备：

- GLM API Key
- Google Places API Key

Google Places API 申请地址：

```text
https://developers.google.com/maps/documentation/places/web-service/get-api-key
```

## 本地配置步骤

在启动 FrontMatter 之前，请先确认 PostgreSQL 和 Redis 服务已经启动。

Ubuntu 示例：

```bash
sudo systemctl enable --now postgresql
sudo systemctl enable --now redis-server
```

### 1. 创建数据库

在本地 PostgreSQL 中创建名为 `frontmatter` 的数据库。

示例：

```bash
sudo -u postgres psql
CREATE DATABASE frontmatter;
\q
```

如果你的本地 PostgreSQL 用户名或密码不同，请后续同步修改 `.env`。

### 2. 复制环境变量模板

```bash
cp .env.example .env
```

然后编辑 `.env`，至少设置：

- `FRONTMATTER_DATABASE_URL`
- `FRONTMATTER_REDIS_URL`
- `FRONTMATTER_LLM_API_KEY`
- `FRONTMATTER_GOOGLE_PLACES_API_KEY`
- `FRONTMATTER_DEMO_AUTH_PASSWORD`
- `FRONTMATTER_DEMO_AUTH_SECRET`

### 3. 安装后端依赖

```bash
make install-backend
```

这会创建 `backend/.venv`，并根据 `backend/pyproject.toml` 安装 Python 依赖。

### 4. 安装前端依赖

```bash
make install-frontend
```

这会根据 `frontend/package.json` 安装 Node.js 依赖。

## 启动、关闭、重启

仓库已经提供 bash 脚本。

### 启动

```bash
bash scripts/start.sh
```

或者：

```bash
make start
```

### 关闭

```bash
bash scripts/stop.sh
```

或者：

```bash
make stop
```

### 重启

```bash
bash scripts/restart.sh
```

或者：

```bash
make restart
```

## 本地访问地址

默认地址：

- 前端：`http://127.0.0.1:3000`
- 后端：`http://127.0.0.1:8000`

## Demo 登录信息

如果 `.env` 中启用了 demo auth：

- 用户名：`demo`
- 密码：`FRONTMATTER_DEMO_AUTH_PASSWORD` 的值

## 日志与运行文件

启动脚本会把运行时文件写到：

```text
.run/
```

关键文件：

- `.run/backend.pid`
- `.run/frontend.pid`
- `.run/logs/backend.log`
- `.run/logs/frontend.log`

查看日志：

```bash
make logs
```

## 数据库迁移

手动执行迁移：

```bash
make migrate
```

新建 Alembic migration：

```bash
make migrate-new msg="describe-change"
```

## 常用开发命令

只启动后端：

```bash
make dev-backend
```

只启动前端：

```bash
make dev-frontend
```

运行 lint：

```bash
make lint
```

运行测试：

```bash
make test
```

## 核心功能

### 图片化输入

- 支持上传 `PNG`、`JPG`、`WEBP`
- 分析门头或室内空间图片
- 生成结构化空间蓝图

### 新加坡限定的位置处理

- `At site now`：使用设备定位
- `Search address`：通过 Google Places 解析新加坡地址
- 非新加坡定位会被明确拒绝

### 结构化租约与经营输入

表单可采集：

- 月租
- 面积
- 租期
- 服务费
- 装修预算
- 免租期
- 押金月数
- 水电
- 人工
- 营销
- 保险
- 牌照费用
- 复原成本
- 租金递增
- 收入增长
- turnover rent
- 开业爬坡月数
- 折现率
- 日均顾客数
- 客单价
- 毛利率

### F&B 就绪度筛查

针对餐饮业态，系统还会采集：

- 烹饪强度
- approved use 状态
- 供水条件
- 电力条件
- 燃气
- 地漏
- 隔油池
- 排烟
- 废水
- 上下货条件
- 招牌条件

### 可追溯评分

- 最终数字评分来自规则模型
- LLM 不直接决定最终分数
- 财务假设是可见、可追踪的

### 租约经济学分析

系统会输出：

- NPV
- IRR
- 折现回本期
- 盈亏平衡日顾客数
- baseline / downside / severe downside 三档情景

### 候选点对比

- 最多比较 3 个用户主动选择的地址
- 在同一组经营假设下横向比较

## 功能状态

| 功能 | 状态 | 说明 |
|---|---|---|
| Demo 登录 | 完成 | 轻量公开测试口令 |
| 图片上传 | 完成 | PNG、JPG、WEBP |
| 空间蓝图生成 | 完成 | 尽调辅助，不是 CAD 测绘 |
| 新加坡地址自动补全 | 完成 | Google Places 限定新加坡 |
| 非新加坡定位拒绝 | 完成 | 不支持地区会被拦截 |
| 周边商业地图观察 | 完成 | 仅作观察信号 |
| 结构化租约表单 | 完成 | 包含租约与经营假设 |
| F&B readiness 采集 | 完成 | 水、电、燃气、排烟、隔油池等 |
| 可追溯规则评分 | 完成 | LLM 不直接决定总分 |
| 折现现金流引擎 | 完成 | NPV、IRR、折现回本、盈亏平衡顾客数 |
| 压力测试 | 完成 | baseline、downside、severe downside |
| What-if 交互模拟 | 完成 | 在工作台调节客流、客单价、租金 |
| 候选点对比 | 完成 | 最多 3 个用户选址 |
| 匿名 outcome 导出 / 导入 | 完成 | 本地校准流程 |
| 公共市场证据面板 | 完成 | 展示上下文 benchmark |
| 自动生成替代地址 | 未实现 | 为避免虚构推荐，已主动关闭 |
| 铺位级租金 comparables | 部分实现 | 目前仅有公共上下文 |
| 生产级多用户认证 | 部分实现 | 当前仅 demo gate |

## 当前技术边界

- 它是尽调辅助，不是法律、估值或测绘工具
- 市场证据基于公开数据，不是铺位级租金情报
- 结果依赖用户输入的经营假设
- 认证仍是 demo 级，不是企业级

## 补充文档

- [Architecture](docs/ARCHITECTURE.md)
- [Feature Status](docs/feature-status.md)
- [Demo Walkthrough](docs/demo-walkthrough.md)
