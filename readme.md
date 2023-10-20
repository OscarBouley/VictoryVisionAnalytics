# Projet React Native

Ce projet est une application mobile développée avec React Native. L'application est un simulateur de match de rugby entre deux équipes nationales. Suivez les étapes ci-dessous pour installer les dépendances et lancer l'application.

## Installation

Avant de commencer, assurez-vous d'avoir [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) installés sur votre machine.

1. Clonez ce dépôt sur votre ordinateur en utilisant la commande suivante :

```bash
git clone https://github.com/OscarBouley/VictoryVisionAnalytics.git
```

2. Changez de répertoire :

```bash
cd VictoryVisionAnalytics
```

3. Installez les dépendances :

```bash
npm install
```

## Lancement du projet

```bash
npx expo
```

# API

Une API est aussi mise à disposition afin d'utiliser le simulateur de match. Vous pouvez la trouver dans le dossier "API" du dépôt.

## Installation

1. Installez flask :

```bash
pip install flask
```

2. Changez de répertoire :

```bash
cd API
```

## Lancement de l'API

```bash
python MatchSimulatorAPI.py
```

## Utilisation

L'API est normalement accessible à l'adresse suivante : http://127.0.0.1:5000/predict_winner.
Voici un exemple de requête get pour utiliser l'API :

```bash
http://127.0.0.1:5000/predict_winner?equipe1=France&equipe2=England
```

Cette requête retournera le nom de l'équipe gagnante entre la France et l'Angleterre, la fiabilité de la prédiction ainsi que le pourcentage de chance que l'équipe en question gagne et cela sous forme de json.

``` json
{
    "equipe_gagnante": "France",
    "fiabilite": 67.94871794871796,
    "pourcentage_chance": 65.38461538461539
}
```

La requête prend deux paramètres; equipe1 et equipe2. Ces paramètres doivent être des noms d'équipes nationales de rugby. Les noms d'équipes doivent être écrits en anglais et sans accents. Voici la liste des équipes disponibles :
- Argentina
- Australia
- England
- France
- Ireland
- Italy
- New Zealand
- Scotland
- South Africa
- Wales

equipe1 correspond à l'équipe qui reçoit et equipe2 correspond à l'équipe qui se déplace. Si vous souhaitez qu'aucune des des deux équipes ne reçoive, vous pouvez ajouter le paramètre neutral=true à votre requête.

```bash
http://127.0.0.1:5000/predict_winner?equipe1=France&equipe2=England&neutral=true
```

Voici ce que renvoie cette requête :

``` json
{
    "equipe_gagnante": "England",
    "fiabilite": 68.66666666666667,
    "pourcentage_chance": 54.666666666666664
}
```

# Auteurs
Oscar Bouley et Kylian Baconnet