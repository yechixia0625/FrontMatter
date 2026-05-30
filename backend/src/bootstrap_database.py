import asyncio
import os
from urllib.parse import SplitResult, urlsplit, urlunsplit

import asyncpg


def _database_url_from_env() -> str:
    value = os.getenv("FRONTMATTER_DATABASE_URL") or os.getenv("LEASENS_DATABASE_URL")
    if not value:
        raise RuntimeError("Database URL is not configured.")
    return value


def _target_database_name(database_url: str) -> str:
    path = urlsplit(database_url).path.lstrip("/")
    if not path:
        raise RuntimeError("Database URL does not include a database name.")
    return path.split("/", 1)[0]


def _admin_database_url(database_url: str) -> str:
    normalized_url = database_url.replace("postgresql+asyncpg://", "postgresql://", 1)
    parsed = urlsplit(normalized_url)
    return urlunsplit(
        SplitResult(
            scheme=parsed.scheme,
            netloc=parsed.netloc,
            path="/postgres",
            query=parsed.query,
            fragment=parsed.fragment,
        )
    )


def _quoted_identifier(identifier: str) -> str:
    return '"' + identifier.replace('"', '""') + '"'


async def ensure_database_exists(database_url: str) -> None:
    target_db = _target_database_name(database_url)
    admin_url = _admin_database_url(database_url)
    connection = await asyncpg.connect(admin_url)
    try:
        exists = await connection.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            target_db,
        )
        if exists:
            print(f"Database '{target_db}' already exists.")
            return
        await connection.execute(f"CREATE DATABASE {_quoted_identifier(target_db)}")
        print(f"Database '{target_db}' created.")
    finally:
        await connection.close()


async def _main() -> None:
    await ensure_database_exists(_database_url_from_env())


if __name__ == "__main__":
    asyncio.run(_main())
