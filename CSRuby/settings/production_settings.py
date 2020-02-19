from CSRuby.settings.common_settings import *

# SECURITY WARNING: keep the secret key used in production secret!
# SET environment variable SECRET_KEY on server
# SECRET_KEY = os.environ['SECRET_KEY']
SECRET_KEY = 'jduk5ieuy&-%z1cr@!31c46#0kf^40-&fx3(sud-q#$o#az^ao'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['0.0.0.0', 'localhost']

CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True

SECURE_HSTS_SECONDS = 3600

SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_HSTS_PRELOAD = True

SECURE_REFERRER_POLICY = 'no-referrer'

# TODO:  SET environment variable DJANGO_SETTINGS_MODULE to CSRuby.settings.production_settings on server
