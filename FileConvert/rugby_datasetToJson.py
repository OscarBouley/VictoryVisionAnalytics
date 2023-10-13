import pandas as pd

# Charger le fichier CSV dans un DataFrame
df = pd.read_csv('../datasets/rugby dataset.csv')

# Convertir le DataFrame en JSON
rugby_data_json = df.to_json(orient='records')

# Sauvegarder les données JSON dans un fichier
with open('rugby_data.json', 'w') as json_file:
    json_file.write(rugby_data_json)
