from typing import Literal

from pydantic import BaseModel, Field, model_validator


class SpaceIntakeRequest(BaseModel):
    """Parsed from multipart form-data."""

    photo_bytes: bytes
    photo_filename: str | None = None
    photo_content_type: str
    business_type: str = Field(..., min_length=1, max_length=100)
    expected_rent: float = Field(..., gt=0)
    square_meters: float = Field(..., gt=0)
    location_mode: Literal["current", "address"]
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    site_label: str | None = None

    @model_validator(mode="after")
    def require_address_label(self) -> "SpaceIntakeRequest":
        if self.location_mode == "address" and not (self.site_label or "").strip():
            raise ValueError("Address location requires a selected site label.")
        return self
