from src.models.orm.outcome import OutcomeRecord
from src.repositories.base import BaseRepository


class OutcomeRepository(BaseRepository[OutcomeRecord]):
    def __init__(self, session):
        super().__init__(OutcomeRecord, session)
