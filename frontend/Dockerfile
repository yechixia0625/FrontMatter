FROM docker.1ms.run/node:20-alpine AS base
ARG API_PROXY_TARGET=http://api:8000
ARG NPM_REGISTRY=https://registry.npmmirror.com
ENV API_PROXY_TARGET=${API_PROXY_TARGET}
ENV npm_config_registry=${NPM_REGISTRY}
ENV npm_config_fetch_retries=5
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000
ENV npm_config_audit=false
ENV npm_config_fund=false
ENV npm_config_progress=false
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
