"""
This file defines the database models
"""

import datetime
import os
import random
from .settings import APP_FOLDER
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
        Field(
            "winner",
            "integer",
            "reference auth_user",
            default=None
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
        Field("image_name"),
        Field(
            "player_id", "reference auth_user", requires=IS_IN_DB(db, db.auth_user.id)
        ),
    ],
)


def set_random_pfp(f, i):
    working_dir = os.path.join(APP_FOLDER, "static", "img", "pfp")
    img = random.choice(
        [
            x
            for x in os.listdir(working_dir)
            if os.path.isfile(os.path.join(working_dir, x))
        ]
    )

    db.profile_pictures.update_or_insert(
        db.profile_pictures.player_id == i, image_name=img, player_id=i
    )

    return False


db.auth_user._after_insert.append(lambda f, i: db.ratings.insert(player_id=i))
db.auth_user._after_insert.append(set_random_pfp)

db.commit()
