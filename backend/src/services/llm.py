import base64

import httpx

from src.config.settings import Settings


class LLMService:
    """Async LLM client wrapping an OpenAI-compatible API."""

    def __init__(self, settings: Settings):
        self._api_key = settings.llm_api_key.strip()
        self._client = httpx.AsyncClient(
            base_url=settings.llm_base_url,
            headers={"Authorization": f"Bearer {self._api_key}"},
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
        if self._uses_placeholder_key():
            return self._demo_completion(prompt)

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

    def _uses_placeholder_key(self) -> bool:
        normalized = self._api_key.strip().lower()
        return (
            not normalized
            or normalized.startswith(("replace-with", "your-"))
            or normalized in {
                "changeme",
                "placeholder",
            }
        )

    @staticmethod
    def _demo_completion(prompt: str) -> str:
        normalized = prompt.lower()
        if "spatial blueprint" in normalized:
            return """{"spatialBlueprint":{"aspectRatio":1.45,"elements":[
            {"type":"door","x":0,"y":42,"w":5,"h":18,"label":"Main Entrance"},
            {"type":"window","x":0,"y":8,"w":5,"h":28,"label":"Street Display"}],
            "heatZones":[{"x":22,"y":28,"radius":16,"intensity":0.82,
            "type":"high_profit"},{"x":78,"y":78,"radius":18,"intensity":0.24,
            "type":"dead_zone"}],"flowPath":[{"x":5,"y":51},{"x":34,"y":48},
            {"x":62,"y":32}],"zoneInsights":[{"x":22,"y":44,
            "type":"opportunity","title":"ENTRY CONVERSION",
            "reason":"Use first sightline for fast-moving, high-margin items."},
            {"x":78,"y":78,"type":"friction","title":"LOW EXPOSURE",
            "reason":"Reserve back area for prep, storage, or appointment-led service."}]}}"""
        if "financial model" in normalized:
            return """{"financialModel":{"baseRent":5200,"expectedTraffic":135,
            "conversionRate":0.09,"averageSpend":32,"grossMargin":0.64,
            "fixedCostNonRent":2400,"initialDecorationCost":48000}}"""
        return """{"summary":{"score":78,"verdict":"APPROVED WITH CONDITIONS",
        "paybackMonths":14.0}}"""
