from types import SimpleNamespace

import pytest

from src.config.settings import Settings
from src.services.llm import LLMService


class CaptureClient:
    def __init__(self):
        self.payload = None

    async def post(self, path, json):
        self.payload = json
        return SimpleNamespace(
            raise_for_status=lambda: None,
            json=lambda: {"choices": [{"message": {"content": "{}"}}]},
        )


@pytest.mark.asyncio
async def test_multimodal_completion_embeds_uploaded_image_as_data_url():
    service = LLMService(Settings())
    capture = CaptureClient()
    service._client = capture

    await service.complete(
        "Inspect this space.",
        image_bytes=b"\x89PNG\r\n\x1a\n",
        image_content_type="image/png",
    )

    content = capture.payload["messages"][-1]["content"]
    assert content[0] == {"type": "text", "text": "Inspect this space."}
    assert content[1]["type"] == "image_url"
    assert content[1]["image_url"]["url"].startswith("data:image/png;base64,")
