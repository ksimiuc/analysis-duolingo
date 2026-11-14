// ===== FORTSCHRITT PAGE =====
// This script is only for fortschritt.html. It shows one black box per chapter
// with the number of correct answers that page.js saved on the check page.

// 1. Read what page.js saved, e.g. {"1": 3, "2": 1}
const saved = localStorage.getItem("progress"); // the saved text, or null if nothing was saved yet
const progress = JSON.parse(saved ?? "{}"); // turn the text back into an object; use an empty one if nothing was saved
const list = document.getElementById("progress-list"); // the empty <div> in fortschritt.html where the boxes go

// 2. One black box per chapter that has at least one correct answer
for (const [chapter, count] of Object.entries(progress)) { // go through each pair, e.g. chapter "1" with count 3
  const box = document.createElement("div"); // make a new, empty <div> (not on the page yet)
  box.className = "progress-box"; // give it the class that style.css paints black
  box.innerHTML = `<h2>Kapitel ${chapter}</h2><p>${count} richtig</p>`; // put the chapter title and the count inside
  list.append(box); // now add the box to the page
} // end of the loop: every chapter has its box

// 3. Nothing solved yet? Say so instead of showing an empty page
if (list.children.length === 0) { // no boxes were added
  list.textContent = "Noch nichts gelöst."; // show a short message instead
} // end of the check
