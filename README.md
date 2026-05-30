# FrontMatter

面向线下商铺租赁尽调的本地部署系统。  
输入铺位图片、基础租赁参数、地址与经营假设，系统会输出一份可追溯的租赁评估结果，包括空间分析、附近商业观察、现金流测算、风险标记和候选点对比。

当前仓库已经按本地 Docker 运行方式整理过，默认访问地址为：

```text
http://127.0.0.1:8080
```

## 这套系统现在能做什么

### 1. 铺位图片分析

- 支持上传 `PNG / JPG / WEBP` 图片。
- 后端会调用视觉模型生成 `spatialBlueprint`，用于输出：
  - 平面元素识别
  - 热区与低效区
  - 基础动线建议
  - 空间层面的提示性结论

说明：这里是“空间尽调辅助”，不是 CAD 级别的精准测绘。

### 2. 地址定位与地图观察

- 用户可以选择：
  - `At site now`：使用当前定位
  - `Search address`：手动搜索地址
- 地址搜索与解析走服务端 Google Places。
- 分析结果支持：
  - `Decision Plan`：空间蓝图视图
  - `Live Market`：地图视图
- 地图会展示：
  - 当前评估点
  - 附近已验证商家
  - 距离推导出的 `proximityLevel`

说明：附近商家是“观察信号”，不是客流证明，也不是自动推荐结论。

### 3. F&B / 零售租赁尽调输入

表单目前支持的不只是基础租金，还包括：

- 基础租赁项：
  - 月租
  - 面积
  - 租期
  - 服务费
  - 装修预算
- F&B readiness：
  - 烹饪强度
  - 楼层
  - 格局
  - 供水
  - 电力
  - 燃气
  - 地漏
  - 隔油池
  - 排烟
  - 污水
  - 经营用途审批状态
- 高级经营假设：
  - 免租期
  - 押金月数
  - 其他月成本
  - 水电、人工、营销、保险
  - 牌照费、复原成本
  - 年租金递增
  - 年收入增长
  - turnover rent
  - 开业爬坡月数
  - 折现率
  - 日顾客数、客单价、毛利率
  - 门头、层高、得房率、仓储、座位数

### 4. 可追溯评分与风险标记

系统当前使用的是“规则驱动的可追溯评分”，不是让 LLM 直接决定总分。

输出包括：

- `0-100` 总分
- `scoreBreakdown`
- 分项评分组件
- `riskFlags`
- 置信度等级
- 结论性 verdict

当前设计原则：

- 数字评分由结构化规则模型决定
- LLM 负责图像理解和建议性文本
- 不再让 LLM 直接篡改总分

### 5. 折现现金流与压力测试

系统当前已经不是简单回本计算，而是租期现金流模型。会输出：

- `NPV`
- `IRR`
- `Discounted Payback`
- `Break-Even Daily Customers`
- 月度现金流表
- 三组情景：
  - `BASE`
  - `DOWN -10%`
  - `SEVERE -25%`

### 6. What-if 模拟

在结果页底部可以实时调整：

- 客流
- 客单价
- 租金

系统会同步更新：

- 月利润
- 回本月数
- 租金压力

### 7. 候选点对比

用户可以手动添加最多 `3` 个候选点，并分别填写：

- 地址
- 月租

系统会对这些候选点分别输出：

- 基线 NPV
- 对应地图观察
- 按相同假设下的对比结果

说明：当前是“用户手动选择候选点，再比较”。  
系统**不会自动编造备选地址**。

### 8. 公共市场证据

结果页会展示公开市场证据模块，包括：

- URA 零售租金指数快照
- 数据来源与更新时间
- retrieval mode

说明：这些是“市场上下文”，不是该铺位的真实成交租金。

### 9. 匿名结果校准

当前支持本地校准流程：

- 录入实际经营结果
- 导出匿名 JSON
- 导入匿名 JSON
- 查看样本量与基础偏差统计

这套功能用于后续校准模型，不会导出图片或地址文本。

### 10. 简易登录

当前系统支持统一访客口令登录，适合公网测试或小范围演示。

- 登录接口：`/api/auth/login`
- Session 检查：`/api/auth/session`
- 注销接口：`/api/auth/logout`

这不是正式生产级多用户权限系统，只是一个轻量访问门槛。

## 当前技术结构

### 前端

- Next.js
- React
- TypeScript
- Tailwind CSS
- Leaflet

### 后端

- FastAPI
- SQLAlchemy
- AsyncPG
- Alembic
- Redis

### 基础服务

- PostgreSQL + pgvector
- Redis
- Nginx
- Docker Compose

## 当前模型配置

当前仓库默认按以下方式配置：

- LLM 提供商：`GLM`
- Base URL：`https://open.bigmodel.cn/api/paas/v4`
- 模型：`glm-4.1v-thinking-flash`

说明：

- LLM 主要用于空间理解、结构化提取和建议文本
- 最终数值总分与现金流逻辑不直接由 LLM 决定

## 需要的外部能力

### 1. GLM API Key

需要配置：

```text
FRONTMATTER_LLM_API_KEY
```

### 2. Google Places API Key

需要配置：

```text
FRONTMATTER_GOOGLE_PLACES_API_KEY
```

官方申请说明：

- https://developers.google.com/maps/documentation/places/web-service/get-api-key
- https://console.cloud.google.com/google/maps-apis/credentials

说明：

- 地址自动补全和地址解析依赖 Google Places
- 附近商家观察也依赖 Google Places
- Key 只在后端使用，不应暴露到前端

## 环境变量

仓库根目录使用 `.env`。

至少需要确认这些变量：

```text
FRONTMATTER_LLM_API_KEY=
FRONTMATTER_LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
FRONTMATTER_LLM_MODEL=glm-4.1v-thinking-flash

FRONTMATTER_GOOGLE_PLACES_API_KEY=
FRONTMATTER_GOOGLE_PLACES_SEARCH_RADIUS_METERS=500

FRONTMATTER_DEMO_AUTH_ENABLED=true
FRONTMATTER_DEMO_AUTH_USERNAME=demo
FRONTMATTER_DEMO_AUTH_PASSWORD=FrontMatterDemo2026!
FRONTMATTER_DEMO_AUTH_SECRET=replace-with-a-random-secret

PUBLIC_HTTP_PORT=8080
```

如果你本机通过代理访问外网，当前仓库也支持：

```text
DOCKER_BUILD_HTTP_PROXY=
DOCKER_BUILD_HTTPS_PROXY=
DOCKER_BUILD_NO_PROXY=
DOCKER_RUNTIME_HTTP_PROXY=
DOCKER_RUNTIME_HTTPS_PROXY=
DOCKER_RUNTIME_NO_PROXY=
```

## 启动方式

### 方案 A：当前默认 compose

这是当前仓库主用的启动方式：

```bash
sudo docker compose up -d --build
```

启动后访问：

```text
http://127.0.0.1:8080
```

当前默认 compose 的特点：

- `api` 通过宿主机网络访问外部代理
- `db` 映射到宿主机 `15432`
- `redis` 映射到宿主机 `16379`

这样做的原因是兼容本机已有服务和代理环境，避免占用常见的 `5432 / 6379`。

### 方案 B：portable compose

如果你的环境更适合纯容器内部互联，也可以使用：

```bash
sudo docker compose -f docker-compose.portable.yml up -d --build
```

## 常用检查命令

查看容器状态：

```bash
sudo docker compose ps
```

查看日志：

```bash
sudo docker compose logs -f api
sudo docker compose logs -f web
sudo docker compose logs -f nginx
```

健康检查：

```bash
curl -i http://127.0.0.1:8080/api/v1/health
```

Session 检查：

```bash
curl -i http://127.0.0.1:8080/api/auth/session
```

地址搜索检查：

```bash
curl -i -X POST http://127.0.0.1:8080/api/locations/autocomplete \
  -H 'Content-Type: application/json' \
  --data '{"input":"Nanyang Technological University","sessionToken":"session-token-1"}'
```

## 当前接口能力

### 认证

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

### 地址

- `POST /api/locations/autocomplete`
- `POST /api/locations/resolve`

### 分析

- `POST /api/v1/analyze`

### 报告

- `GET /api/v1/reports/{id}`

### 校准

- `POST /api/v1/calibration/outcomes`
- `GET /api/v1/calibration/export`
- `POST /api/v1/calibration/import`
- `GET /api/v1/calibration/summary`

## 已知边界

这套系统现在更适合叫：

> 商铺租赁初筛与尽调辅助系统

而不是“自动投资决策系统”。

原因很明确：

- 它输出的是基于输入假设与公开数据的经济模型
- 不保证真实营业额
- 不保证真实成交租金
- 不能替代经纪、律师、会计或业主谈判
- 推荐地址自动生成功能当前关闭，不会输出虚构备选点

## 适合的使用场景

- 小商户选址初筛
- F&B 铺位租前尽调
- 多候选铺位对比
- 公开演示版本
- 本地部署研究版本

## 不适合直接宣称的能力

- 保证盈利
- 替代正式估值报告
- 替代法律合规意见
- 替代真实市场调研
- 替代生产级账号权限系统

## 当前仓库状态说明

当前 README 描述的是“仓库现在已经落地的功能”，不是路线图。

如果后续你继续扩展：

- 更完整的多用户权限
- 真正的中心化校准数据平台
- 自动候选地址生成
- 更多官方市场数据接入

需要同步更新本 README，避免文档和实际代码再次脱节。
