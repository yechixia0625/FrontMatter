from fastapi import APIRouter

from src.api.v1 import calibration, health, reports

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(reports.router)
api_router.include_router(calibration.router)
