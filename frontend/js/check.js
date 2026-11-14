// Find the pieces on the page.
// The names differ from Keyboard.js ("answer", "keyboard"), because
// both scripts share one page and a name may only be declared once.
const answerBar = document.getElementById("answer-slots");
const checkButton = document.getElementById("check-button");
const feedback = document.getElementById("feedback");

// 1. Read the student's answer: glue all tile symbols into one string
function readAnswer() {
  let text = "";
  for (const tile of answerBar.querySelectorAll(".tile")) {
    text += tile.dataset.symbol;
  }
  return text;
}

// 2. Clicking "Prüfen" compares the answer with the stored solution
checkButton.addEventListener("click", () => {
  if (readAnswer() === answerBar.dataset.solution) {
    // localStorage only stores text, so turn it into a number first.
    // The very first time there is nothing stored: Number(null) is 0.
    const count = Number(localStorage.getItem("correctAttempts")) + 1;
    localStorage.setItem("correctAttempts", count);
    feedback.textContent = "Richtig!";
  } else {
    feedback.textContent = "Noch nicht.";
  }
});
