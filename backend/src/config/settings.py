from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_prefix="LEASENS_",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "LeaseLens AI"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/leaselens"
    database_pool_size: int = 20

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # LLM
    llm_api_key: str = ""
    llm_base_url: str = "https://open.bigmodel.cn/api/paas/v4"
    llm_model: str = "glm-4.1v-thinking-flash"
    llm_timeout_seconds: int = 120

    # Google Places (server-side only)
    google_places_api_key: str = ""
    google_places_search_radius_meters: int = 500

    # Agent concurrency
    max_concurrent_agents: int = 4
    agent_log_buffer_size: int = 50

    # SSE
    sse_heartbeat_interval: int = 15


@lru_cache
def get_settings() -> Settings:
    return Settings()
