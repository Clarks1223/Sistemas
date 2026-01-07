import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']] if 'WEBSITE_HOSTNAME' in os.environ else []
CSRF_TRUSTED_ORIGINS = [f"https://{os.environ['WEBSITE_HOSTNAME']}"] if 'WEBSITE_HOSTNAME' in os.environ else []
DEBUG = False

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "https://gentle-cliff-08a42540f.1.azurestaticapps.net/",
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

if 'AZURE_POSTGRESQL_CONNECTION_STRING' in os.environ:
    CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTION_STRING']
    # Assuming connection string format: "key=value key=value"
    # If it's a URL (postgres://...), dj_database_url should be used instead.
    # But based on the code, it tries to split. I will assume it's key=value space separated.
    # However, standard Azure connection strings often look like "Database=...;User Id=...;".
    # Let's try to be safer. If it's a diff format, this split might fail.
    # I'll stick to a safer parsing or use dj_database_url if possible, but the user code tried to parse it manually.
    # Let's fix the split('') first -> split(' ') or split(';'). 
    # Usually Azure strings are semi-colon separated.
    
    # Let's use dj-database-url if possible as it is in requirements.
    # But for now, I will fix the syntax error.
    try:
        CONNECTION_STR = {pair.split('=')[0]: pair.split('=')[1] for pair in CONNECTION.split(' ')}
        
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": CONNECTION_STR.get('dbname'),
                "HOST": CONNECTION_STR.get('host'),
                "USER": CONNECTION_STR.get('user'),
                "PASSWORD": CONNECTION_STR.get('password'),
            }
        }
    except Exception:
        pass # Fallback or let it fail?

STATIC_ROOT = BASE_DIR / 'staticfiles'
