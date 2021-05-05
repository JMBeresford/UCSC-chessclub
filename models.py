"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()

db.define_table('games', [
  Field('player_white', 'integer', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id)),
  Field('player_black', 'integer', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id)),
  Field('fen'),
  Field('game_over', 'boolean'),
  Field('winner', 'integer', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id))
])

db.define_table('ratings', [
  Field('rating', 'integer'),
  Field('player_id', 'integer', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id)),
  Field('updated_on', 'datetime', requires=IS_DATETIME())
])

db.define_table('statuses', [
  Field('status', default=""),
  Field('player_id', 'integer', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id))
])

db.commit()
