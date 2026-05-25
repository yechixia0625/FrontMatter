FROM docker.1ms.run/library/python:3.11-slim AS base
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .
COPY . .
CMD ["uvicorn", "src.app_factory:create_app", "--factory", "--host", "0.0.0.0", "--port", "8000"]
