What was made

Keyboard (frontend/keyboard.html, js/Keyboard.js, css/keyboard.css)
- About 105 symbols in 11 groups, which should cover the script's statements.
- Tapping a key copies its symbol into the answer bar as a tile, and tapping a tile removes it.
- The hint text disappears after the first tap.

Check (frontend/check.html, js/check.js, css/check.css)
- A Prüfen button next to the bar.
- It compares the tiles with the stored answer (the definition of injective), shows "Richtig!" or "Noch nicht.", and adds one to correctAttempts in localStorage when the answer is right.

What is still lacking

Next steps
- Test both pages in a browser.
- Commit the new files to Git.

Keyboard
- Tabs instead of one long list.
- A delete-last-tile key.
- Reordering tiles by dragging.

Check
- Accepting more than one correct form, such as the contrapositive.
- No counting when the same correct answer is checked twice.
- Counting wrong attempts.
- One counter per theorem instead of one for the whole site.

Bigger picture
- The answer lives in the HTML. It should move into a JSON file in Phase 4.
- There's no page yet that shows the counter.
- Neither page is connected to the real item page (interface.html).
- interface.html links to css/item.css, which doesn't exist.

Setup
- node wasn't found in my terminal. Run node -v in VS Code to check it's installed.