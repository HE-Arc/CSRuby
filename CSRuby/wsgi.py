"""
WSGI config for CSRuby project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CSRuby.settings.development_settings')

os.environ.setdefault('DATABASE_PASSWORD', '')

application = get_wsgi_application()
