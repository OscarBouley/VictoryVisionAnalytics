import json
from datetime import datetime

# Charger les données du fichier rugby_data.json
with open('../FileConvert/rugby_data.json', 'r') as rugby_file:
    rugby_data = json.load(rugby_file)

def calculer_proba_victoire(equipe1, equipe2, neutral):
    total_matchs = 0
    nb_matchs = 0
    victoires_equipe1 = 0
    victoires_equipe2 = 0
    
    # Parcourir les données des matchs
    for match in rugby_data:
        home_team = match['home_team']
        away_team = match['away_team']
        home_score = match['home_score']
        away_score = match['away_score']
        match_date = datetime.strptime(match['date'], '%Y-%m-%d').date()
        
        # Vérifier si le match concerne les deux équipes spécifiées
        if (home_team == equipe1 and away_team == equipe2) or (home_team == equipe2 and away_team == equipe1):
            # Calculer le poids du match en fonction de son ancienneté
                today = datetime.now().date()
                difference_annees = today.year - match_date.year
                
                poids_match = 0.5
                if difference_annees <= 2:
                    poids_match = 7  # Les matchs de moins de 2 ans sont 5 fois plus importants
                elif difference_annees <= 5:
                    poids_match = 4  # Les matchs de moins de 5 ans sont 3 fois plus importants
                elif difference_annees <= 10:
                    poids_match = 2  # Les matchs de moins de 5 ans sont 3 fois plus importants
                

                if neutral == False :
                    # Vérifier quelle équipe a gagné le match
                    if (home_team == equipe1 and home_score > away_score) :
                        victoires_equipe1 += poids_match
                        total_matchs += poids_match
                        nb_matchs += 1
                    elif (away_team == equipe2 and away_score > home_score):
                        victoires_equipe2 += poids_match
                        total_matchs += poids_match
                        nb_matchs += 1
                else :
                    # Vérifier quelle équipe a gagné le match
                    if (home_team == equipe1 and home_score > away_score) or (away_team == equipe1 and away_score > home_score):
                        victoires_equipe1 += poids_match
                        total_matchs += poids_match
                        nb_matchs += 1
                    elif (home_team == equipe2 and home_score > away_score) or (away_team == equipe2 and away_score > home_score):
                        victoires_equipe2 += poids_match
                        total_matchs += poids_match
                        nb_matchs += 1
                
    
    # Calculer la probabilité de victoire de l'équipe1
    if total_matchs > 0:
        proba_victoire_equipe1 = victoires_equipe1 / total_matchs
        proba_victoire_equipe2 = victoires_equipe2 / total_matchs
        fiabilite = total_matchs / 100
        
        if proba_victoire_equipe1 > proba_victoire_equipe2:
            equipe_gagnante = equipe1
            pourcentage_chance = proba_victoire_equipe1 * 100
            print("victoires équipe 1:",victoires_equipe1)
            print("victoires équipe 2:",victoires_equipe2)
            print(total_matchs)
            print(nb_matchs)
        else:
            equipe_gagnante = equipe2
            pourcentage_chance = proba_victoire_equipe2 * 100
            print("victoires équipe 1:",victoires_equipe1)
            print("victoires équipe 2:",victoires_equipe2)
            print(total_matchs)
            print(nb_matchs)
        
        return {
            "equipe_gagnante": equipe_gagnante,
            "pourcentage_chance": pourcentage_chance,
            "fiabilite": fiabilite * 100
        }
    else:
        return {
            "equipe_gagnante": None,
            "pourcentage_chance": 0,
            "fiabilite": 0
        }

# Exemple d'utilisation de la fonction
equipe1 = "France"
equipe2 = "South Africa"
resultat = calculer_proba_victoire(equipe1, equipe2, False)
print(f"L'équipe la plus susceptible de gagner est {resultat['equipe_gagnante']} avec {resultat['pourcentage_chance']:.2f}% de chance. Fiabilité : {resultat['fiabilite']:.2f}%")
