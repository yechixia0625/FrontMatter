from functools import lru_cache

from pydantic import AliasChoices, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True,
    )

    # App
    app_name: str = Field(
        default="FrontMatter",
        validation_alias=AliasChoices("FRONTMATTER_APP_NAME", "LEASENS_APP_NAME"),
    )
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/frontmatter",
        validation_alias=AliasChoices("FRONTMATTER_DATABASE_URL", "LEASENS_DATABASE_URL"),
    )
    database_pool_size: int = Field(
        default=20,
        validation_alias=AliasChoices(
            "FRONTMATTER_DATABASE_POOL_SIZE",
            "LEASENS_DATABASE_POOL_SIZE",
        ),
    )

    # Redis
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        validation_alias=AliasChoices("FRONTMATTER_REDIS_URL", "LEASENS_REDIS_URL"),
    )

    # LLM
    llm_api_key: str = Field(
        default="",
        validation_alias=AliasChoices("FRONTMATTER_LLM_API_KEY", "LEASENS_LLM_API_KEY"),
    )
    llm_base_url: str = Field(
        default="https://open.bigmodel.cn/api/paas/v4",
        validation_alias=AliasChoices("FRONTMATTER_LLM_BASE_URL", "LEASENS_LLM_BASE_URL"),
    )
    llm_model: str = Field(
        default="glm-4.1v-thinking-flash",
        validation_alias=AliasChoices("FRONTMATTER_LLM_MODEL", "LEASENS_LLM_MODEL"),
    )
    llm_timeout_seconds: int = Field(
        default=120,
        validation_alias=AliasChoices(
            "FRONTMATTER_LLM_TIMEOUT_SECONDS",
            "LEASENS_LLM_TIMEOUT_SECONDS",
        ),
    )

    # Google Places (server-side only)
    google_places_api_key: str = Field(
        default="",
        validation_alias=AliasChoices(
            "FRONTMATTER_GOOGLE_PLACES_API_KEY",
            "LEASENS_GOOGLE_PLACES_API_KEY",
        ),
    )
    google_places_search_radius_meters: int = Field(
        default=500,
        validation_alias=AliasChoices(
            "FRONTMATTER_GOOGLE_PLACES_SEARCH_RADIUS_METERS",
            "LEASENS_GOOGLE_PLACES_SEARCH_RADIUS_METERS",
        ),
    )
    onemap_access_token: str = Field(
        default="",
        validation_alias=AliasChoices(
            "FRONTMATTER_ONEMAP_ACCESS_TOKEN",
            "LEASENS_ONEMAP_ACCESS_TOKEN",
        ),
    )

    # Demo auth
    demo_auth_enabled: bool = Field(
        default=False,
        validation_alias=AliasChoices(
            "FRONTMATTER_DEMO_AUTH_ENABLED",
            "LEASENS_DEMO_AUTH_ENABLED",
        ),
    )
    demo_auth_username: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "FRONTMATTER_DEMO_AUTH_USERNAME",
            "LEASENS_DEMO_AUTH_USERNAME",
        ),
    )
    demo_auth_password: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "FRONTMATTER_DEMO_AUTH_PASSWORD",
            "LEASENS_DEMO_AUTH_PASSWORD",
        ),
    )
    demo_auth_secret: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "FRONTMATTER_DEMO_AUTH_SECRET",
            "LEASENS_DEMO_AUTH_SECRET",
        ),
    )
    demo_auth_cookie_name: str = Field(
        default="frontmatter_demo_session",
        validation_alias=AliasChoices(
            "FRONTMATTER_DEMO_AUTH_COOKIE_NAME",
            "LEASENS_DEMO_AUTH_COOKIE_NAME",
        ),
    )

    # Agent concurrency
    max_concurrent_agents: int = Field(
        default=4,
        validation_alias=AliasChoices(
            "FRONTMATTER_MAX_CONCURRENT_AGENTS",
            "LEASENS_MAX_CONCURRENT_AGENTS",
        ),
    )
    agent_log_buffer_size: int = Field(
        default=50,
        validation_alias=AliasChoices(
            "FRONTMATTER_AGENT_LOG_BUFFER_SIZE",
            "LEASENS_AGENT_LOG_BUFFER_SIZE",
        ),
    )

    # SSE
    sse_heartbeat_interval: int = Field(
        default=15,
        validation_alias=AliasChoices(
            "FRONTMATTER_SSE_HEARTBEAT_INTERVAL",
            "LEASENS_SSE_HEARTBEAT_INTERVAL",
        ),
    )

    @model_validator(mode="after")
    def validate_demo_auth(self) -> "Settings":
        if not self.demo_auth_enabled:
            return self

        missing = [
            name
            for name, value in (
                ("FRONTMATTER_DEMO_AUTH_USERNAME", self.demo_auth_username),
                ("FRONTMATTER_DEMO_AUTH_PASSWORD", self.demo_auth_password),
                ("FRONTMATTER_DEMO_AUTH_SECRET", self.demo_auth_secret),
            )
            if not value
        ]
        if missing:
            raise ValueError(
                "Demo auth is enabled but required settings are missing: "
                + ", ".join(missing)
            )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
