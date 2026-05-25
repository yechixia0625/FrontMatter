import base64

import httpx

from src.config.settings import Settings


class LLMService:
    """Async LLM client wrapping an OpenAI-compatible API."""

    def __init__(self, settings: Settings):
        self._client = httpx.AsyncClient(
            base_url=settings.llm_base_url,
            headers={"Authorization": f"Bearer {settings.llm_api_key}"},
            timeout=settings.llm_timeout_seconds,
        )
        self._model = settings.llm_model

    async def complete(
        self,
        prompt: str,
        system: str = "",
        image_bytes: bytes | None = None,
        image_content_type: str | None = None,
    ) -> str:
        """Send a chat completion request and return the response text."""
        messages: list[dict] = []
        if system:
            messages.append({"role": "system", "content": system})

        if image_bytes is not None and image_content_type is not None:
            encoded_image = base64.b64encode(image_bytes).decode("ascii")
            user_content = [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{image_content_type};base64,{encoded_image}"
                    },
                },
            ]
        else:
            user_content = prompt
        messages.append({"role": "user", "content": user_content})

        payload = {
            "model": self._model,
            "messages": messages,
        }

        resp = await self._client.post("/chat/completions", json=payload)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

    async def close(self) -> None:
        await self._client.aclose()
