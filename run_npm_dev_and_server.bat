@echo off
cd csruby_frontend_app
(npm run dev && cd .. && python manage.py runserver) || cd ..
