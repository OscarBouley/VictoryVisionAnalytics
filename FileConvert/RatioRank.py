import json

# Charger les données du fichier rugby_data.json
with open('../FileConvert/rugby_data.json', 'r') as rugby_file:
    rugby_data = json.load(rugby_file)

# Créer un dictionnaire pour stocker le nombre de victoires et de matchs joués par chaque équipe
equipe_stats = {}

# Parcourir les données des matchs
for match in rugby_data:
    home_team = match['home_team']
    away_team = match['away_team']
    home_score = match['home_score']
    away_score = match['away_score']
    match_date = match['date']
    
    # Vérifier si le match a eu lieu après 2010
    if int(match_date.split('-')[0]) >= 2018:
        # Mettre à jour les statistiques pour l'équipe à domicile
        if home_team in equipe_stats:
            equipe_stats[home_team]['matchs_joues'] += 1
            if home_score > away_score:
                equipe_stats[home_team]['victoires'] += 1
            equipe_stats[home_team]['matchs_domicile'] += 1
            if home_score > away_score:
                equipe_stats[home_team]['victoires_domicile'] += 1
        else:
            equipe_stats[home_team] = {'matchs_joues': 1, 'victoires': 1 if home_score > away_score else 0, 'matchs_domicile': 1 if home_score > away_score else 0, 'victoires_domicile': 1 if home_score > away_score else 0, 'victoires_exterieur': 0, 'matchs_exterieur': 0}
        
        # Mettre à jour les statistiques pour l'équipe à l'extérieur
        if away_team in equipe_stats:
            equipe_stats[away_team]['matchs_joues'] += 1
            if away_score > home_score:
                equipe_stats[away_team]['victoires'] += 1
            equipe_stats[away_team]['matchs_exterieur'] += 1
            if away_score > home_score:
                equipe_stats[away_team]['victoires_exterieur'] += 1
        else:
            equipe_stats[away_team] = {'matchs_joues': 1, 'victoires': 1 if away_score > home_score else 0, 'matchs_exterieur': 1 if away_score > home_score else 0, 'victoires_exterieur': 1 if away_score > home_score else 0, 'victoires_domicile': 0, 'matchs_domicile': 0}

# Calculer le ratio de victoire pour chaque équipe
for equipe, stats in equipe_stats.items():
    if stats['matchs_joues'] > 0:
        ratio_victoire = round(stats['victoires'] / stats['matchs_joues'], 2)
        ratio_victoire_domicile = round(stats['victoires_domicile'] / stats['matchs_domicile'], 2)
        ratio_victoire_exterieur = round(stats['victoires_exterieur'] / stats['matchs_exterieur'], 2)
        stats['ratio_victoire'] = ratio_victoire
        stats['ratio_victoire_domicile'] = ratio_victoire_domicile
        stats['ratio_victoire_exterieur'] = ratio_victoire_exterieur

# Enregistrer les statistiques au format JSON
with open('teams_stats_since_2018.json', 'w') as json_file:
    json.dump(equipe_stats, json_file, indent=4)
