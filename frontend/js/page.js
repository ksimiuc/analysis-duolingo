// 1. Find the pieces on the page
const answerBar = document.getElementById("answer-slots");
const feedback = document.getElementById("feedback");

function readAnswer() {
  let text = "";
  for (const tile of answerBar.querySelectorAll(".tile")) {
    text += tile.dataset.symbol;
  }
  console.log(text);
  return text.replaceAll(" ", "");
}

// 2. Buttons that do not need the item data: set them up first,
//    so they work even if loading the item fails
document.getElementById("backspace-button").addEventListener("click", () => {
  answerBar.querySelector(".tile:last-of-type")?.remove();
});

document.getElementById("clear-button").addEventListener("click", () => {
  for (const tile of answerBar.querySelectorAll(".tile")) tile.remove();
  feedback.textContent = "";
});

// 3. Which item? Read it from the address: check.html?id=injektiv
const params = new URLSearchParams(location.search);
const id = params.get("id") ?? "injektiv";

// 4. Question templates: one sentence per type, with {placeholders}
const PROMPTS = {
  definition: "{setup} Baue die Definition von «{name}».",
  axiom: "Wie lautet das Axiom «{name}»",
};

function fill(template, item) {
  let text = template;
  for (const key of ["name", "setup"]) {
    text = text.replaceAll(`{${key}}`, item[key] ?? "");
  }
  return text;
}

// 5. Load the item. try/catch: if anything goes wrong, show it on the page
//
// Items come in two shapes:
//   one question:     "solutions": ["..."]
//   several parts:    "parts": [ { "label": "reflexiv", "solutions": ["..."] }, ... ]
// "solutions" is always a list of ALTERNATIVES: any one of them counts as correct.
// We turn both shapes into the same thing, a list of parts, so the rest of
// the code only has to handle one shape.
let parts = null;   // the list of parts to solve, each { label, solutions }; null = nothing loaded
let partIndex = 0;  // which part you are on right now (0 = the first one)
let question = "";  // the question text, without the "Teil 1 von 3" ending
let chapter = null; // FOR THE FORTSCHRITT PAGE: which chapter this item belongs to, filled in below
try {
  const response = await fetch(`data/items/${id}.json`);
  const item = await response.json();

  document.querySelector("h1").textContent = item.name;
  question = fill(PROMPTS[item.type], item);

  // With "parts": use them. Without: make a list with one part and no label.
  parts = item.parts ?? [{ label: null, solutions: item.solutions }];
  showPart(); // write the question for the first part

  chapter = String(item.kapitel); // FOR THE FORTSCHRITT PAGE: read the chapter from the JSON; String() because some files say 1, others "1"
} catch (error) {
  document.querySelector("h1").textContent = "Aufgabe nicht gefunden";
  feedback.textContent = `«${id}» konnte nicht geladen werden. Mit Live Server öffnen?`;
  console.error(error);
}

// Write the question, plus "Teil 2 von 3: symmetrisch" when the item has parts
function showPart() {
  const part = parts[partIndex];                // the part you are on
  let text = question;                          // start with the normal question
  if (part.label) {                             // only items with parts have a label
    text += ` Teil ${partIndex + 1} von ${parts.length}: ${part.label}.`; // +1 because people count from 1
  }
  document.getElementById("prompt").textContent = text; // show it
}

// 6. Checking
document.getElementById("check-button").addEventListener("click", () => {
  if (parts === null) return;                   // no item loaded, nothing to compare with
  if (partIndex >= parts.length) return;        // every part is already solved: no more points

  // All correct answers for this part, without spaces (readAnswer() removes spaces too)
  const accepted = parts[partIndex].solutions.map((s) => s.replaceAll(" ", ""));

  if (accepted.includes(readAnswer())) {        // your answer matches one of them
    // ----- FOR THE FORTSCHRITT PAGE: count this correct answer -----
    // Saved as one object, e.g. {"1": 3, "2": 1}: chapter number → correct answers
    const progress = JSON.parse(localStorage.getItem("progress") ?? "{}"); // read the saved counts; empty object if none yet

    // The overall total: only ever goes up, paying does not touch it.
    // If it was never saved (older visitors), start from the points they already have.
    const pointsSoFar = Object.values(progress).reduce((sum, n) => sum + n, 0); // add up all chapter counts
    const total = Number(localStorage.getItem("totalPoints") ?? pointsSoFar) + 1; // old total (or the sum) plus this answer
    localStorage.setItem("totalPoints", total); // save the new overall total

    progress[chapter] = (progress[chapter] ?? 0) + 1; // add 1 to this chapter; ?? 0 starts a new chapter at 0
    localStorage.setItem("progress", JSON.stringify(progress)); // turn the object into text and save it in the browser
    // ----- end of the Fortschritt part; fortschritt.js reads these counts -----

    partIndex += 1;                             // move on to the next part
    if (partIndex < parts.length) {             // there is another part
      for (const tile of answerBar.querySelectorAll(".tile")) tile.remove(); // empty the bar for it
      showPart();                               // show its question
      feedback.textContent = `Richtig! Weiter mit «${parts[partIndex].label}».`;
    } else {                                    // that was the last part (or the only one)
      feedback.textContent = "Richtig!";
    }
  } else {
    feedback.textContent = "Noch nicht.";
  }
});



