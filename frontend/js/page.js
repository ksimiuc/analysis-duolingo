// ===== PAGE.JS: the brain of check.html =====
// Loads an item, asks the question, checks your answer, hands out points. Main character energy.

// 1. Find the pieces on the page
const answerBar = document.getElementById("answer-slots"); // the bar where your tiles hang out
const feedback = document.getElementById("feedback");       // the little line that says "Richtig!" or roasts you with "Noch nicht."

function readAnswer() {                                     // turns the tiles into one string we can compare
  let text = "";                                            // start with an empty string, fresh as a new notebook
  for (const tile of answerBar.querySelectorAll(".tile")) { // visit every tile in the bar, left to right
    text += tile.dataset.symbol;                            // glue its symbol onto the end, no cap
  }                                                         // end of the tile tour
  console.log(text);                                        // spill the tea in the console (Cmd + Option + J to peek)
  return text.replaceAll(" ", "");                          // yeet all spaces, so "x ~ x" and "x~x" are the same thing
}                                                           // end of readAnswer

// 2. Buttons that do not need the item data: set them up first,
//    so they work even if loading the item fails
document.getElementById("backspace-button").addEventListener("click", () => { // the ⌫ button, the "oops" button
  answerBar.querySelector(".tile:last-of-type")?.remove();  // delete the last tile; ?. = chill if there is none
});                                                         // end of ⌫

document.getElementById("clear-button").addEventListener("click", () => { // the Leeren button, aka the nuke
  for (const tile of answerBar.querySelectorAll(".tile")) tile.remove();  // every tile: bye bye
  feedback.textContent = "";                                // wipe the old feedback too, clean slate bestie
});                                                         // end of Leeren

// 3. Which item? Read it from the address: check.html?id=injektiv
const params = new URLSearchParams(location.search);        // read the "?id=..." part of the address bar
const id = params.get("id") ?? "injektiv";                  // grab the id; no id in the address? injektiv is the default pick

// 4. Question templates: one sentence per type, with {placeholders}
const PROMPTS = {                                           // a little lookup table: item type → question sentence
  definition: "{setup} Baue die Definition von «{name}».",  // for definitions; {setup} and {name} get swapped in later
  axiom: "Wie lautet das Axiom «{name}»",                   // for axioms, short and sweet
};                                                          // end of the templates

function fill(template, item) {                             // swaps the {placeholders} for real text from the item
  let text = template;                                      // start with the template as it is
  for (const key of ["name", "setup"]) {                    // the two placeholders we know about
    text = text.replaceAll(`{${key}}`, item[key] ?? "");    // swap e.g. {name} for "Injektivität"; missing? swap for nothing
  }                                                         // end of the swap loop
  return text;                                              // hand back the finished sentence, chef's kiss
}                                                           // end of fill

// 5. Load the item. try/catch: if anything goes wrong, show it on the page
//
// Items come in two shapes:
//   one question:     "solutions": ["..."]
//   several parts:    "parts": [ { "label": "reflexiv", "solutions": ["..."] }, ... ]
// "solutions" is always a list of ALTERNATIVES: any one of them counts as correct.
// We turn both shapes into the same thing, a list of parts, so the rest of
// the code only has to handle one shape. Work smarter, not harder.
let parts = null;   // the list of parts to solve, each { label, solutions }; null = nothing loaded yet
let partIndex = 0;  // which part you are on right now (0 = the first one, computers count from 0, it's a whole thing)
let question = "";  // the question text, without the "Teil 1 von 3" ending
let chapter = null; // FOR THE FORTSCHRITT PAGE: which chapter this item belongs to, filled in below
try {                                                       // "try" = attempt this; if anything explodes, jump to catch
  const response = await fetch(`data/items/${id}.json`);    // go fetch the JSON file; await = wait for it, patience queen
  const item = await response.json();                       // turn the file's text into a real JavaScript object

  document.querySelector("h1").textContent = item.name;     // put the item's name in the big title
  question = item.prompt                                    // does the item bring its own finished question? (the axioms do)
    ? `${item.setup ?? ""} ${item.prompt}`                // yes: setup + that question. ? : = a tiny if/else in one line
    : fill(PROMPTS[item.type], item);                       // no: build it from the template, like before

  if (item.inWorten) {                                      // a tip in plain words? (the axioms have one)
    document.getElementById("hint-text").textContent = item.inWorten; // put the tip text in the box
    document.getElementById("hint").hidden = false;        // and show the closed "Tipp" box; one click opens it
  }                                                         // end of the tip

  // With "parts": use them. Without: make a list with one part and no label.
  parts = item.parts ?? [{ label: null, solutions: item.solutions }]; // ?? = "if there are no parts, use this instead"
  showPart();                                               // write the question for the first part, let's gooo

  chapter = String(item.kapitel);                           // FOR THE FORTSCHRITT PAGE: String() because some files say 1, others "1"
  document.body.dataset.kapitel = chapter;                  // sets <body data-kapitel="2">: Kapitel 2 items switch on the night theme
} catch (error) {                                           // something went sideways (missing file, broken JSON, unknown shape)
  document.querySelector("h1").textContent = "Aufgabe nicht gefunden"; // tell the user, title edition
  feedback.textContent = `«${id}» konnte nicht geladen werden. Mit Live Server öffnen?`; // and a hint what might be up
  console.error(error);                                     // the full error in red in the console, for detective work
}                                                           // end of try/catch

// Write the question, plus "Teil 2 von 3: symmetrisch" when the item has parts
function showPart() {                                       // updates the question line for the current part
  const part = parts[partIndex];                            // the part you are on
  let text = question;                                      // start with the normal question
  if (part.label) {                                         // only items with parts have a label (single ones have null)
    text += ` Teil ${partIndex + 1} von ${parts.length}: ${part.label}.`; // +1 because humans count from 1, unlike us nerds
  }                                                         // end of the label bit
  document.getElementById("prompt").textContent = text;     // put it on the page, main stage
}                                                           // end of showPart

// 6. Checking: the moment of truth
document.getElementById("check-button").addEventListener("click", () => { // runs when you smash Prüfen
  if (parts === null) return;                               // no item loaded, nothing to compare with: dip
  if (partIndex >= parts.length) return;                    // every part already solved: no infinite points glitch, sorry

  // All correct answers for this part, without spaces (readAnswer() removes spaces too)
  const accepted = parts[partIndex].solutions.map((s) => s.replaceAll(" ", "")); // .map = do this to every entry, get a new list

  if (accepted.includes(readAnswer())) {                    // your answer matches one of them? slay
    // ----- FOR THE FORTSCHRITT PAGE: count this correct answer -----
    // Saved as one object, e.g. {"1": 3, "2": 1}: chapter number → correct answers
    const progress = JSON.parse(localStorage.getItem("progress") ?? "{}"); // read the saved counts; empty object if none yet

    // The overall total: only ever goes up, paying does not touch it. Lifetime stats, baby.
    // If it was never saved (older visitors), start from the points they already have.
    const pointsSoFar = Object.values(progress).reduce((sum, n) => sum + n, 0); // add up all chapter counts (.reduce = squash a list into one value)
    const total = Number(localStorage.getItem("totalPoints") ?? pointsSoFar) + 1; // old total (or the sum) plus this answer
    localStorage.setItem("totalPoints", total);             // save the new overall total, locked in

    progress[chapter] = (progress[chapter] ?? 0) + 1;       // +1 for this chapter; ?? 0 lets a brand-new chapter start at 0
    localStorage.setItem("progress", JSON.stringify(progress)); // object → text, then save it in the browser (it only stores text)
    // ----- end of the Fortschritt part; fortschritt.js reads these counts -----

    partIndex += 1;                                         // level up: on to the next part
    if (partIndex < parts.length) {                         // there is another part waiting
      for (const tile of answerBar.querySelectorAll(".tile")) tile.remove(); // clear the bar for round two
      showPart();                                           // show the next part's question
      feedback.textContent = `Richtig! Weiter mit «${parts[partIndex].label}».`; // hype the user and say what's next
    } else {                                                // that was the last part (or the only one)
      feedback.textContent = "Richtig!";                    // item cleared, GG
    }                                                       // end of "next part or done"
  } else {                                                  // the answer matches none of the accepted solutions
    feedback.textContent = "Noch nicht.";                   // not quite, try again; partIndex stays put
  }                                                         // end of "right or wrong"
});                                                         // end of the Prüfen button
