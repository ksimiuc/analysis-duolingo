"""Checks every item file for mistakes a computer can find.
Run from the project folder:  python3 tools/check_items.py
"""
import json
import re
from pathlib import Path

ITEMS = Path("frontend/data/items")
KEYBOARD = Path("frontend/js/Keyboard.js")

# 1. Collect every character that can be typed with the symbol keyboard
keyboard_text = KEYBOARD.read_text(encoding="utf-8")
allowed = set()
for group in re.findall(r"symbols:\s*\[(.*?)\]\s*\}", keyboard_text):
    for symbol in re.findall(r'"([^"]*)"', group):
        allowed.update(symbol)

problems = []
seen = {}  # solution text -> file it first appeared in

# 2. Go through all item files
for path in sorted(ITEMS.glob("*.json")):
    if path.name == "index.json":
        continue

    try:
        item = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        problems.append(f"{path.name}: not valid JSON ({error})")
        continue

    for field in ["id", "type", "name", "kapitel"]:
        if field not in item:
            problems.append(f"{path.name}: field '{field}' is missing")

    if item.get("id") != path.stem:
        problems.append(f"{path.name}: id is '{item.get('id')}', but the file name says '{path.stem}'")

    # An item has parts adn orr solutions
    parts = item.get("parts") or [{"solutions": item.get("solutions", [])}]
    for part in parts:
        solutions = [s.replace(" ", "") for s in part.get("solutions", [])]
        if not solutions or "" in solutions:
            problems.append(f"{path.name}: empty or missing solution")
        for solution in solutions:
            unknown = sorted(set(solution) - allowed)
            if unknown:
                problems.append(f"{path.name}: not on the keyboard: {' '.join(unknown)}")
            if solution and solution in seen:
                problems.append(f"{path.name}: same solution as {seen[solution]}")
            seen.setdefault(solution, path.name)

# 3. Every id in index.json needs a file
index = json.loads((ITEMS / "index.json").read_text(encoding="utf-8"))
for entry in index["items"]:
    if not (ITEMS / f"{entry['id']}.json").exists():
        problems.append(f"index.json: no file for id '{entry['id']}'")

# 4. Report
for problem in problems:
    print("✗", problem)
print(f"\n{len(problems)} problem(s) found." if problems else "All item files look fine.")
raise SystemExit(1 if problems else 0)