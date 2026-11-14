//which item? read it from the adress: iterface html?item=injectiv or whatever
const params = new URLSearchParams(location.search);
const id= params.get("id") ?? "injektiv";

// 2. Load that item's data file and tun text into an objekt"
const response = await fetch(`data/items/${id}.json`);
const item = await response.json(); 

//3. Question templates: one setence per type, with {placeholders}
const PROMPTS = {
    definition: "{setup} Baue die Definition von «{name}».", 
    axiom: "Wie lautet das Axiom «{name}»",

};
function fill(template, item){
    let text = template;
    for (const key of ["name", "setup"]) {
        text = text.replaceAll(`{${key}}`, item[key] ?? "")}
    return text;
}

document.querySelector("h1").textContent = item.name;
document.getElementById("prompt").textContent = fill(PROMPTS[item.type], item);

// 4. The accepted answers, with spaces removed
const solutions = item.solutions.map((s) => s.replaceAll(" ", ""));

//. Checking: your code from chck.js
const answerBar = document.getElementById("answer-slots")
const feedback = document.getElementById("feedback");

function readAnswer() {
  let text = "";
  for (const tile of answerBar.querySelectorAll(".tile")) {
    text += tile.dataset.symbol;
  }
  return text.replaceAll(" ", "");
}

document.getElementById("check-button").addEventListener("click", () => {
  if (solutions.includes(readAnswer())) {   // the changed line
    const count = Number(localStorage.getItem("correctAttempts")) + 1;
    localStorage.setItem("correctAttempts", count);
    feedback.textContent = "Richtig!";
  } else {
    feedback.textContent = "Noch nicht.";
  }
});

// Remove the last tile
document.getElementById("backspace-button").addEventListener("click", () => {
  answerBar.querySelector(".tile:last-of-type")?.remove();
});

// Remove all tiles
document.getElementById("clear-button").addEventListener("click", () => {
  for (const tile of answerBar.querySelectorAll(".tile")) tile.remove();
  feedback.textContent = "";
});