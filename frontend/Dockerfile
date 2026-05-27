FROM docker.1ms.run/node:20-alpine AS base
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG API_PROXY_TARGET=http://api:8000
ENV API_PROXY_TARGET=${API_PROXY_TARGET}
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install -g npm@11.8.0 && npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
