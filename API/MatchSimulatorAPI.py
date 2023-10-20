from flask import Flask, request, jsonify
from MatchWinnerSimulator import calculer_proba_victoire 

app = Flask(__name__)

@app.route('/predict_winner', methods=['GET'])
def predict_winner():
    equipe1 = request.args.get('equipe1')
    equipe2 = request.args.get('equipe2')
    neutral = request.args.get('neutral')
    neutral = bool(neutral)
    if equipe1 and equipe2:
        resultat = calculer_proba_victoire(equipe1, equipe2, neutral)
        return jsonify(resultat)
    else:
        return jsonify({'error': 'Les paramètres "equipe1" et "equipe2" sont requis.'})

if __name__ == '__main__':
    app.run(debug=True)
