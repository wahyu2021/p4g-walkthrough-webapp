import sys
import os
import json
from bs4 import BeautifulSoup

# Add scraper to path so we can import parser
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'scraper')))
from parser import parse_ffaq_table

def extract_tables():
    with open('data/raw/activities.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Quests
    quests = []
    for h3 in soup.find_all('h3'):
        if 'Quests' in h3.text:
            table = h3.find_next_sibling('table')
            if table:
                print('Quests Table Found!')
                quests = parse_ffaq_table(table)
                print(f"Parsed {len(quests)} quests.")
                print(json.dumps(quests[:1], indent=2))
                with open('data/quests.json', 'w', encoding='utf-8') as out:
                    json.dump(quests, out, indent=2)
            break

    # Books
    books = []
    for h3 in soup.find_all('h3'):
        if 'Books' in h3.text:
            table = h3.find_next_sibling('table')
            if table:
                print('Books Table Found!')
                books = parse_ffaq_table(table)
                print(f"Parsed {len(books)} books.")
                print(json.dumps(books[:1], indent=2))
                with open('data/books.json', 'w', encoding='utf-8') as out:
                    json.dump(books, out, indent=2)
            break

if __name__ == '__main__':
    extract_tables()
