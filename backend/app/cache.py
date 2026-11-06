"""Small best-effort Redis cache for computed aggregates (NFR-009).

Every endpoint that reads through this module must still answer correctly,
only slower, when Redis or a given key is missing -- caching is an
optimisation here, never a dependency the request can fail on.
"""

import json
import os
from typing import Any

import redis

REDIS_URL = os.getenv("REDIS_URL")


def _client() -> "redis.Redis | None":
    if not REDIS_URL:
        return None
    try:
        client = redis.from_url(REDIS_URL, socket_connect_timeout=1, socket_timeout=1)
        client.ping()
        return client
    except Exception:  # noqa: BLE001 -- cache is best-effort, never blocks a read
        return None


def get_cached(key: str) -> Any | None:
    """The cached value for `key`, or None on a miss, a disabled cache, or
    any Redis error -- all three look the same to the caller."""
    client = _client()
    if client is None:
        return None
    try:
        raw = client.get(key)
    except Exception:  # noqa: BLE001
        return None
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except (TypeError, ValueError):
        return None


def set_cached(key: str, value: Any, ttl: int) -> None:
    """Best-effort write-through; silently does nothing when Redis is
    unavailable, so a cache failure never fails the request that computed
    the value in the first place."""
    client = _client()
    if client is None:
        return
    try:
        client.setex(key, ttl, json.dumps(value))
    except Exception:  # noqa: BLE001
        pass
