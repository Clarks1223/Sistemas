"""
WSGI config for backend_Generales project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
settings_module = 'backend_Generales.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'backend_Generales.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
