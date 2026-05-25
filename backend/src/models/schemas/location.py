from pydantic import BaseModel, Field


class AutocompleteRequest(BaseModel):
    input: str = Field(..., min_length=2, max_length=200)
    sessionToken: str = Field(..., min_length=8, max_length=128)


class LocationPrediction(BaseModel):
    placeId: str
    text: str


class AutocompleteResponse(BaseModel):
    predictions: list[LocationPrediction]


class ResolveLocationRequest(BaseModel):
    placeId: str = Field(..., min_length=1, max_length=300)
    sessionToken: str = Field(..., min_length=8, max_length=128)


class ResolvedLocation(BaseModel):
    siteLabel: str
    latitude: float
    longitude: float
