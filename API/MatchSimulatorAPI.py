from flask import Flask, request, jsonify
from MatchWinnerSimulator import calculer_proba_victoire  # Importez votre fonction de prédiction

app = Flask(__name__)

# Créez une route pour votre API
@app.route('/predict_winner', methods=['GET'])
def predict_winner():
    equipe1 = request.args.get('equipe1')
    equipe2 = request.args.get('equipe2')
    
    if equipe1 and equipe2:
        resultat = calculer_proba_victoire(equipe1, equipe2)
        return jsonify(resultat)
    else:
        return jsonify({'error': 'Les paramètres "equipe1" et "equipe2" sont requis.'})

if __name__ == '__main__':
    app.run(debug=True)
