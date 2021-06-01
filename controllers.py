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

from .settings import APP_FOLDER
from py4web import action, request, response, abort, redirect, URL
import random
import os
from yatl.helpers import A
import json
from .common import (
    db,
    session,
    T,
    cache,
    auth,
    logger,
    authenticated,
    unauthenticated,
    flash,
)
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)


@action("index")
@action.uses(db, auth, "index.html")
def index():
    if not auth.get_user() == {}:
        redirect(URL("home"))
    else:
        return {"noboard": False, "zoominto": True}


@action("auth/login")
@action.uses(db, auth, "signin.html")
def login():
    return {"noboard": False, "zoominto": False}


@action("auth/register")
@action.uses(db, auth, "register.html")
def register():
    return {"noboard": False, "zoominto": False}


@action("home")
@action.uses(db, auth, auth.user, "home.html")
def home():
    me = auth.get_user()
    my_id = auth.get_user()['id']
    #games = db( db.games.game_over & ( (db.games.player_white == my_id) | (db.games.player_black == my_id)) ).select().as_dict()
    games = db( db.games.game_over ).select().as_dict()
    users = db(db.auth_user.id != my_id ).select(db.auth_user.id, db.auth_user.username, db.auth_user.first_name, db.auth_user.last_name ).as_dict()
    ratings = db(db.ratings).select().as_dict()
    return {"noboard": False,
            "zoominto": True,
            "user": json.dumps(auth.get_user()),
            "games": json.dumps(games),
            "users": json.dumps(users),
            "ratings": json.dumps(ratings),
            }


@action("leaderboards")
@action.uses(db, auth, "leaderboards.html")
def leaderboards():
    games = db(db.games).select().as_dict()
    ratings = db(db.ratings).select().as_dict()

    return {
        "noboard": False,
        "zoominto": False,
        "games": json.dumps(games),
        "ratings": json.dumps(ratings),
    }


@action("profile")
@action.uses(db, auth, auth.user, "profile.html")
def profile():
    match_history = request.params.mhist

    if not match_history:
        match_history = False
    else:
        match_history = True

    user = auth.get_user()
    row = db(db.statuses["player_id"] == user["id"]).select().first()
    user["status"] = row.status if row else ""
    games = (
        db(
            (db.games["player_black"] == user["id"])
            | (db.games["player_white"] == user["id"])
        )
        .select()
        .as_list()
    )

    row = db(db.profile_pictures.player_id == user["id"]).select().first()
    (filename, fullname) = db.profile_pictures.image.retrieve(row.image, nameonly=True)

    return dict(
        user=json.dumps(user),
        games=json.dumps(games),
        isMe=True,
        pfp=filename,
        matchHistory=match_history,
    )


@action("profile/<profile_id:int>")
@action.uses(db, auth, auth.user, "profile.html")
def profile_(profile_id):
    try:
        if profile_id == auth.get_user()["id"]:
            redirect(URL("profile"))

        user = db.auth_user(profile_id).as_dict()
        try:
            user["status"] = (
                db(db.statuses["player_id"] == user["id"]).select().first()["status"]
            )
        except TypeError:
            pass

        games = (
            db(
                (db.games["player_black"] == user["id"])
                | (db.games["player_white"] == user["id"])
            )
            .select()
            .as_dict()
        )

        row = db(db.profile_pictures.player_id == profile_id).select().first()
        (filename, fullname) = db.profile_pictures.image.retrieve(
            row.image, nameonly=True
        )
    except AttributeError:
        redirect(URL("index"))

    return dict(
        user=json.dumps(user), games=json.dumps(games), isMe=False, pfp=filename
    )


@action("game/<id:int>")
@action.uses(db, auth, auth.user, "game.html")
def game(id):
    game = db.games(id).as_dict()

    if not game:
        response.status = 404
        return "Game not found"

    white_id = game["player_white"]
    black_id = game["player_black"]

    white = (
        db(db.auth_user.id == white_id)
        .select(db.auth_user.id, db.auth_user.username, db.auth_user.email)
        .as_list()
    )
    black = (
        db(db.auth_user.id == black_id)
        .select(db.auth_user.id, db.auth_user.username, db.auth_user.email)
        .as_list()
    )

    players = {"white": white[0], "black": black[0]}

    return dict(
        game=json.dumps(game),
        players=json.dumps(players),
        user=json.dumps(auth.get_user()),
    )


@action("setpfprandom/<id:int>")
@action.uses(db)
def setpfprandom(id):

    working_dir = os.path.join(APP_FOLDER, "static", "img", "pfp")
    img = random.choice(
        [
            x
            for x in os.listdir(working_dir)
            if os.path.isfile(os.path.join(working_dir, x))
        ]
    )
    img_path = os.path.join(working_dir, img)

    with open(img_path, "rb") as stream:
        db.profile_pictures.insert(image=stream, player_id=id)

    return dict()


@action("populate")
@action.uses(db, auth, auth.user, "populate.html")
def populate():
    return dict()


@action("freeboard")
@action.uses(auth, auth.user, "freeboard.html")
def freeboard():
    return dict()


@action("populategames")
@action.uses(db, auth, auth.user)
def populategames():
    games = [
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
            "game_over": True,
            "winner": 1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
            "game_over": True,
            "winner": 2,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
            "game_over": True,
            "winner": 1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
        {
            "player_white": 1,
            "player_black": 2,
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "game_over": False,
            "winner": -1,
        },
    ]

    for game in games:
        db.games.insert(
            player_white=game["player_white"],
            player_black=game["player_black"],
            fen=game["fen"],
            game_over=game["game_over"],
            winner=game["winner"],
        )

    return "Done"


@action("post/newgame", method=["POST"])
@action.uses(db, auth, auth.user)
def newgame():
    data = request.json

    try:
        db.games.insert(
            player_white=data["player_white"],
            player_black=data["player_black"],
        )
        response.status = 200
        return dict()
    except Exception as e:
        print(e)
        response.status = 500
        return "There was an error"


@action("initelo/<id:int>")
@action.uses(db)
def initelo(id):
    rating = db(db.ratings.player_id == id).select().first()

    if rating != {}:
        db.ratings.insert(player_id=id)

    return dict()


@action("get/user")
@action.uses(db)
def getUser():
    id = request.params.id

    if not id:
        response.status = 404
        return "User not found"

    try:
        player = (
            db(db.auth_user.id == id)
            .select(db.auth_user.id, db.auth_user.username, db.auth_user.email)
            .as_dict()
        )
    except:
        response.status = 500
        return "There was an issue with the request."

    return player


@action("get/pfp")
@action.uses(db)
def getPfp():
    id = request.params.id

    if not id:
        response.status = 404
        return "Profile picture not found"

    try:
        row = db(db.profile_pictures.player_id == id).select().first()
        (filename, fullname) = db.profile_pictures.image.retrieve(
            row.image, nameonly=True
        )
    except:
        response.status = 500
        return "There was an issue with the request."

    return filename


@action("get/elo")
@action.uses(db)
def elo():
    id = request.params.id

    if not id:
        response.status = 404
        return "Elo not found"

    try:
        rating = db(db.ratings.player_id == id).select().as_dict()
    except:
        response.status = 500
        return "There was an issue with the request."

    return rating


@action("get/fen")
@action.uses(db)
def getfen():
    id = request.params.id

    if not id:
        response.status = 404
        return "Fen not found"

    try:
        game = db(db.games.id == id).select().first().as_dict()
    except:
        response.status = 500
        return "There was an issue with the request."

    return game["fen"]


@action("post/game", method=["POST"])
@action.uses(db, auth, auth.user)
def updatefen():
    data = request.json

    game = db.games(data["game"])

    game.fen = data["fen"]
    game.update_record()

    return dict()


@action("post/status", method=["POST"])
@action.uses(db, auth, auth.user)
def updateStatus():
    data = request.json
    print(data)

    try:
        db.statuses.update_or_insert(
            db.statuses.player_id == data["id"],
            player_id=data["id"],
            status=data["status"],
        )
        response.status = 200
    except Exception as e:
        print(e)
        response.status = 500
        return "Something went wrong..."

    return dict()


@action("websocket/<id:int>")
@action.uses(auth, auth.user)
def websocket(id):
    ws = request.environ.get("wsgi.websocket")
    while True:
        msg = ws.receive()
        if msg is not None:
            for client in ws.handler.server.clients.values():
                client.ws.send(msg)
        else:
            break
