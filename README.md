# CSRuby
CSRuby est une application permettant de rechercher des items du jeux vidéo Counter-Strike: Global Offensive. Il donne également la possibilité d'afficher les personnes interessé à acheter et/ou vendre des items.

# Installation
## Windows
Créer un environnement virtuel
```
mkvirtualenv [nom_env_virt]
```
Pour activer/désactiver l'environnement virtuel
```
workon [nom_env_virt]
deactivate
```
Cloner le repository. Installer les dépendences pythons avec :
```
pip install -r requirements.txt
```
Seeder la base de données avec les fixtures:
```
python manage.py loaddata csruby_app/fixtures/items.json csruby_app/fixtures/prices.json csruby_app/fixtures/users.json
```
Installer les dépendences Nodes de l'application frontend avec :
```
cd csruby_frontend_app/ # se deplacer dans le dossier contenant package.json
npm install
```
