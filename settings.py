"""
This is an optional file that defined app level settings such as:
- database settings
- session settings
- i18n settings
This file is provided as an example:
"""
import os
from py4web.core import required_folder

# try import private settings
try:
    from .private.secrets import *
except (ImportError, ModuleNotFoundError):
    pass

# db settings
APP_FOLDER = os.path.dirname(__file__)
APP_NAME = os.path.split(APP_FOLDER)[-1]
# DB_FOLDER:    Sets the place where migration files will be created
#               and is the store location for SQLite databases
if not os.environ.get("GAE_INSTANCE"):
    DB_FOLDER = os.path.join(APP_FOLDER, 'databases')
    DB_URI = f"postgres://{DB_USER}:{DB_PASSWORD}@{DB_CONNECTION}"
    DB_POOL_SIZE = 1
    DB_MIGRATE = True
    DB_FAKE_MIGRATE = False  # maybe?

# G Cloud db
if os.environ.get("GAE_ENV") or os.environ.get("GAE_INSTANCE"):
    CLOUD_DB_URI = f"google:MySQLdb://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}?unix_socket=/cloudsql/{DB_CONNECTION}"
    CLOUD_DB_POOL_SIZE = 1
    CLOUD_DB_MIGRATE = False
    CLOUD_DB_FAKE_MIGRATE = False  # maybe?

# location where static files are stored:
# STATIC_FOLDER = required_folder(APP_FOLDER, "static")

# location where to store uploaded files:
# UPLOAD_FOLDER = required_folder(APP_FOLDER, "uploads")

# send email on regstration
VERIFY_EMAIL = False

# account requires to be approved ?
REQUIRES_APPROVAL = False

# ALLOWED_ACTIONS:
# ["all"]
# ["login", "logout", "request_reset_password", "reset_password", "change_password", "change_email", "update_profile"]
# if you add "login", add also "logout"
ALLOWED_ACTIONS = ["all"]


# email settings
SMTP_SSL = False
SMTP_SERVER = None
SMTP_SENDER = "you@example.com"
SMTP_LOGIN = "username:password"
SMTP_TLS = False

# session settings
SESSION_TYPE = "database"
SESSION_SECRET_KEY = "c90f618b-8a3b-481c-81fd-8f7212ddddf5"  # replace this with a uuid
MEMCACHE_CLIENTS = ["127.0.0.1:11211"]
REDIS_SERVER = "localhost:6379"

# logger settings
LOGGERS = [
    "warning:stdout"
]  # syntax "severity:filename" filename can be stderr or stdout

try:
    if OAUTH2GOOGLE_CLIENT_ID:
        pass
except:
    OAUTH2GOOGLE_CLIENT_ID = None

# single sign on Okta (will be used if provided. Please also add your tenant
# name to py4web/utils/auth_plugins/oauth2okta.py. You can replace the XXX
# instances with your tenant name.)
OAUTH2OKTA_CLIENT_ID = None
OAUTH2OKTA_CLIENT_SECRET = None

# single sign on Google (will be used if provided)
OAUTH2FACEBOOK_CLIENT_ID = None
OAUTH2FACEBOOK_CLIENT_SECRET = None

# enable PAM
USE_PAM = False

# enable LDAP
USE_LDAP = False
LDAP_SETTINGS = {
    "mode": "ad",
    "server": "my.domain.controller",
    "base_dn": "ou=Users,dc=domain,dc=com",
}

# i18n settings
T_FOLDER = required_folder(APP_FOLDER, "translations")

# Celery settings
USE_CELERY = False
CELERY_BROKER = "redis://localhost:6379/0"
