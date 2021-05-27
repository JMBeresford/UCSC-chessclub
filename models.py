"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get("email") if auth.current_user else None


def get_time():
    dt = datetime.datetime.utcnow()
    return dt.__str__()


db.define_table(
    "games",
    [
        Field(
            "player_white",
            "integer",
            "reference auth_user",
            requires=IS_IN_DB(db, db.auth_user.id),
        ),
        Field(
            "player_black",
            "integer",
            "reference auth_user",
            requires=IS_IN_DB(db, db.auth_user.id),
        ),
        Field(
            "fen", default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        ),
        Field("game_over", "boolean", default=False),
        Field(
            "winner",
            "integer",
            "reference auth_user",
        ),
        Field("date", default=get_time),
    ],
)

db.define_table(
    "ratings",
    [
        Field("rating", "integer", default=800),
        Field(
            "player_id",
            "integer",
            "reference auth_user",
            requires=IS_IN_DB(db, db.auth_user.id),
        ),
        Field("updated_on", default=get_time),
    ],
)

db.define_table(
    "statuses",
    [
        Field("status", default=""),
        Field(
            "player_id",
            "integer",
            "reference auth_user",
            requires=IS_IN_DB(db, db.auth_user.id),
        ),
    ],
)

db.define_table(
    "profile_pictures",
    [
        Field("image", "upload"),
        Field(
            "player_id", "reference auth_user", requires=IS_IN_DB(db, db.auth_user.id)
        ),
    ],
)

db.commit()
