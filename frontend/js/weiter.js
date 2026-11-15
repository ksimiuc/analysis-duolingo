// ===== WEITER: "← Zurück · Axiom 3 von 16 · Weiter →" on check.html =====
// Finds the current item in index.json, among the items of the same type,
// and links to the one before and the one after. Works for any type:
// axioms walk through all 16, definitions through the definitions.

const nav = document.getElementById("item-nav");                     // the empty <nav> in check.html
const id = new URLSearchParams(location.search).get("id") ?? "injektiv"; // which item is open (same default as page.js)

const NAMES = { axiom: "Axiom", definition: "Definition" };          // how each type is called on screen

const index = await fetch("data/items/index.json").then((r) => r.json()); // the list of all items
const current = index.items.find((entry) => entry.id === id);        // this item's entry, or undefined if it is not listed

if (current) {                                                       // only items listed in index.json get links
  const same = index.items.filter((entry) => entry.type === current.type); // all items of the same type, in order
  const position = same.indexOf(current);                            // where we are: 0 = first
  const before = same[position - 1];                                 // the one before (undefined if we are first)
  const after = same[position + 1];                                  // the one after (undefined if we are last)
  const name = NAMES[current.type] ?? "Aufgabe";                     // "Axiom", "Definition", or a fallback

  nav.innerHTML =                                                    // build the three pieces
    (before ? `<a href="check.html?id=${before.id}">← Zurück</a>` : "<span></span>") + // link, or an empty spacer
    `<span>${name} ${position + 1} von ${same.length}</span>` +      // e.g. "Axiom 3 von 16" (+1: humans count from 1)
    (after ? `<a href="check.html?id=${after.id}">Weiter →</a>` : `<a href="${current.type === "axiom" ? "axiome.html" : "index.html"}">Übersicht</a>`); // last one: back to the overview
}                                                                    // end of "item is listed"

// ===== end of WEITER =====
