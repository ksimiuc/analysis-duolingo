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
let solution = null;
let chapter = null; // FOR THE FORTSCHRITT PAGE: which chapter this item belongs to, filled in below
try {
  const response = await fetch(`data/items/${id}.json`);
  const item = await response.json();

  document.querySelector("h1").textContent = item.name;
  document.getElementById("prompt").textContent = fill(PROMPTS[item.type], item);

  // The solution is a list of tiles: glue them into one string, like readAnswer() does
  solution = item.solutions.join("").replaceAll(" ", "");
  chapter = String(item.kapitel); // FOR THE FORTSCHRITT PAGE: read the chapter from the JSON; String() because some files say 1, others "1"
} catch (error) {
  document.querySelector("h1").textContent = "Aufgabe nicht gefunden";
  feedback.textContent = `«${id}» konnte nicht geladen werden. Mit Live Server öffnen?`;
  console.error(error);
}

// 6. Checking
document.getElementById("check-button").addEventListener("click", () => {
  if (solution === null) return; // no item loaded, nothing to compare with

  if (readAnswer() === solution) {
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
    feedback.textContent = "Richtig!";
  } else {
    feedback.textContent = "Noch nicht.";
  }
});



