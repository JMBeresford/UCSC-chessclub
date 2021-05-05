"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
import json
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)

@action('index')
@action.uses(db, auth, 'index.html')
def index():
  if auth.get_user() != {}:
    redirect(URL('home'))
  else:
    return { "noboard": False, "zoominto": True }

@action('auth/login')
@action.uses(db, auth, 'signin.html')
def login():
  return { "noboard": False, "zoominto": False }

@action('auth/register')
@action.uses(db, auth, 'register.html')
def register():
  return { "noboard": False, "zoominto": False }

@action('home')
@action.uses(db, auth, auth.user, 'home.html')
def home():
  return { "noboard": False, "zoominto": True, "user": json.dumps(auth.get_user()) }

@action('leaderboards')
@action.uses(db,auth,'leaderboards.html')
def leaderboards():
  return { "noboard": False, "zoominto": False }

@action('profile')
@action.uses(db, auth, auth.user, 'profile.html')
def profile():
  user = auth.get_user()
  user['status'] = db(db.statuses["player_id"] == user['id']).select().first()
  games = db((db.games["player_black"] == user['id']) | (db.games["player_white"] == user['id'])).select().as_list()
  return dict(user = json.dumps(user), games = games, isMe = True)

@action('profile/<profile_id:int>')
@action.uses(db, auth, auth.user, 'profile.html')
def profile_(profile_id):
  try:
    if profile_id == auth.get_user()['id']:
      redirect(URL('profile'))

    user = db.auth_user(profile_id).as_dict()
    try:
      user['status'] = db(db.statuses["player_id"] == user['id']).select().first()['status']
    except TypeError:
      pass
    
    games = db((db.games["player_black"] == user['id']) | (db.games["player_white"] == user['id'])).select().as_list()
  except AttributeError:
    redirect(URL('index'))

  return dict(user = json.dumps(user), games = json.dumps(games), isMe = False)

@action('populate')
@action.uses(db, auth, auth.user, 'populate.html')
def populate():
  return dict()

@action('populategames')
@action.uses(db, auth, auth.user)
def populategames():
  games = [
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", "game_over": True, "winner" : 1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", "game_over": True, "winner" : 2},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", "game_over": True, "winner" : 1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
    {"player_white": 1, "player_black": 2, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "game_over": False, "winner" : -1},
  ]

  for game in games:
    db.games.insert(
      player_white=game['player_white'],
      player_black=game['player_black'],
      fen=game['fen'],
      game_over=game['game_over'],
      winner=game['winner']
    )

  return "Done"
