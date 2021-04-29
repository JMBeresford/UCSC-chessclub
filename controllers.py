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
  user['status'] = "Statuses are for chumps"
  games = games = {"wins": 8999, "losses": 50000, "draws": 0, "mostWins": {}, "mostLosses": {}, "mostPlayed": {}}
  return dict(user = json.dumps(user), games = games, isMe = True)

@action('profile/<profile_id:int>')
@action.uses(db, auth, auth.user, 'profile.html')
def _profile(profile_id):
  user = {"id": profile_id, "username": "Wade Watts", "status": "The Gunter life isn't for everyone :/"}
  games = {"wins": 9001, "losses": 12, "draws": 0, "mostWins": {}, "mostLosses": {}, "mostPlayed": {}}
  return dict(user = user, games = games, isMe = False)