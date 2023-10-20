import requests
from bs4 import BeautifulSoup
import csv

url = "https://www.betclic.fr/coupe-du-monde-2023-s5/coupe-du-monde-2023-c34"

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

event_divs = soup.find_all('div', class_='groupEvents ng-star-inserted')

match_data_list = []

for event_div in event_divs:
    event_cards = event_div.find_all('sports-events-event', class_='groupEvents_card ng-star-inserted')
    
    for event_card in event_cards:
        team_names = event_card.find_all('div', class_='scoreboard_contestantLabel')
        team1 = team_names[0].text.strip()
        team2 = team_names[1].text.strip()

        match_time = event_card.find('div', class_='event_infoTime').text.strip()

        odds_elements = event_card.find_all('span', class_='oddValue')
        odds = [odd.text.strip().replace(',', '.') for odd in odds_elements]  

        match_data = [team1, team2, match_time, odds[0], odds[1], odds[2]]
        match_data_list.append(match_data)

csv_file = 'match_data.csv'

with open(csv_file, 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    
    csv_writer.writerow(['Equipe 1', 'Equipe 2', 'Heure du Match', 'Cote Equipe1', 'Cote Match Nul', 'Cote Equipe2'])
    
    csv_writer.writerows(match_data_list)

print("Fin du scrap")
