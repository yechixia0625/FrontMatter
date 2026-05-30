from src.config.settings import Settings


def test_settings_prefers_frontmatter_env_vars(monkeypatch):
    monkeypatch.setenv("FRONTMATTER_LLM_API_KEY", "frontmatter-key")
    monkeypatch.setenv("LEASENS_LLM_API_KEY", "legacy-key")

    settings = Settings(_env_file=None)

    assert settings.llm_api_key == "frontmatter-key"


def test_settings_accepts_legacy_env_vars(monkeypatch):
    monkeypatch.delenv("FRONTMATTER_LLM_API_KEY", raising=False)
    monkeypatch.setenv("LEASENS_LLM_API_KEY", "legacy-key")

    settings = Settings(_env_file=None)

    assert settings.llm_api_key == "legacy-key"


def test_settings_frontmatter_cookie_name_default():
    settings = Settings(_env_file=None)

    assert settings.demo_auth_cookie_name == "frontmatter_demo_session"
