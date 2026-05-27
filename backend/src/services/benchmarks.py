import json
from pathlib import Path

from src.models.schemas.benchmark import MarketBenchmarkBundle
from src.models.schemas.intake import SpaceIntakeRequest

SNAPSHOT_PATH = Path(__file__).resolve().parents[1] / "data" / "public_benchmark_snapshot.json"


class BenchmarkService:
    """Expose free public market context without inventing site-level prices."""

    def __init__(self, snapshot_path: Path = SNAPSHOT_PATH):
        self._snapshot_path = snapshot_path

    def market_context(self, _intake: SpaceIntakeRequest) -> MarketBenchmarkBundle:
        with self._snapshot_path.open(encoding="utf-8") as source_file:
            payload = json.load(source_file)
        return MarketBenchmarkBundle.model_validate(payload)
