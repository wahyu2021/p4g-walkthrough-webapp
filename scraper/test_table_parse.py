import sys
import os
import json
from bs4 import BeautifulSoup
import re

def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()

def parse_ffaq_table(table_el) -> list[dict]:
    if not table_el:
        return []
    
    rows = table_el.find_all("tr")
    if not rows or len(rows) < 2:
        return []
        
    headers = []
    for th in rows[0].find_all(["th", "td"]):
        text = clean_text(th.get_text()).lower().strip()
        text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
        headers.append(text)
        
    data = []
    for row in rows[1:]:
        cols = row.find_all("td")
        if len(cols) != len(headers):
            continue
            
        row_data = {}
        for i, col in enumerate(cols):
            row_data[headers[i]] = clean_text(col.get_text())
        data.append(row_data)
        
    return data

def test_parse():
    with open(r"D:\Coding\P4G Walkthrough\data\raw\dungeons.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    soup = BeautifulSoup(html, "lxml")
    
    # Just grab Heaven dungeon section as an example if we can
    # Or just all tables
    tables = soup.find_all("table", class_="ffaq")
    print(f"Found {len(tables)} ffaq tables.")
    
    results = {}
    for t in tables[:15]:  # Look at first few tables
        prev = t.find_previous_sibling()
        title = clean_text(prev.get_text()) if prev else "Unknown"
        
        parsed = parse_ffaq_table(t)
        results[title] = parsed[:2] # show first 2 rows
        
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_parse()
