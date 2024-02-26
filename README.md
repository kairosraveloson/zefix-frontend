# zefix-ui
Etapes de lancement en local :

## Prérequis
Avoir node installé sur la machine, disponible sur le site (https://nodejs.org/) si ce n'est pas encore fait


## Téléchargement

1 - Télécharger le dépôt en suivant ce lien : https://github.com/kairosraveloson/zefix-frontend
2 - Extracter le fichier zefix-frontend-main.zip en utilisant winrar

## Installation
1 - Acceder au répértoire du projet, où vous avez extracter le fichier \zefix-frontend-main.zip
2 - En utilisant l'invite de commande ou visual studio code, ouvrez le répértoire du projet
3 - Executer la commande : npm install

## Lancement du programme

Avant de lancer ce programme, assurez-vous que le fournisseur d'API soit en marche. 
Si ce n'est pas encore fait :
1 - Il faut télécharger le fichier dans https://github.com/kairosraveloson/zefix-company-backend
2 - Le fichier ReadMe.md va vous guider dans l'installation et l'execution du programme

Quand cette étape est terminée, on continue l'étape précédente.
1 - npm run serve

NB : Dans le répértoire principale, il y a un fichier ".env" 
Assurez-vous que la valeur de VUE_APP_API_BASE_URL pointe à la base url du fournisseur d'API.
La valeur par défaut est VUE_APP_API_BASE_URL=https://localhost:7120
Si ce n'est pas le cas, ajustez votre paramètre pour correspondre à votre configuration.

