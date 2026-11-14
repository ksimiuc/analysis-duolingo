// ===== FORTSCHRITT PAGE =====
// This script is only for fortschritt.html. It shows one black box per chapter
// with the number of correct answers that page.js saved on the check page.
// It also shows the overall total and runs the "Pay 10 points" button.

const PRICE = 10; // how many points one game costs

// 1. Read what page.js saved, e.g. {"1": 3, "2": 1}
const saved = localStorage.getItem("progress"); // the saved text, or null if nothing was saved yet
const progress = JSON.parse(saved ?? "{}"); // turn the text back into an object; use an empty one if nothing was saved
const list = document.getElementById("progress-list"); // the empty <div> in fortschritt.html where the boxes go

// 2. The overall total at the top of the page
const points = Object.values(progress).reduce((sum, n) => sum + n, 0); // the points you can still spend (all chapters added up)
const total = Number(localStorage.getItem("totalPoints") ?? points); // all points ever collected; older visitors start from their current points
document.getElementById("total-points").textContent = `Gesammelt: ${total} Punkte`; // write it into the line at the top

// 3. One black box per chapter that has at least one correct answer
for (const [chapter, count] of Object.entries(progress)) { // go through each pair, e.g. chapter "1" with count 3
  const box = document.createElement("div"); // make a new, empty <div> (not on the page yet)
  box.className = "progress-box"; // give it the class that style.css paints black
  box.innerHTML = `<h2>Kapitel ${chapter}</h2><p>${count} richtig</p>`; // put the chapter title and the count inside
  list.append(box); // now add the box to the page
} // end of the loop: every chapter has its box

// 4. Nothing solved yet? Say so instead of showing an empty page
if (list.children.length === 0) { // no boxes were added
  list.textContent = "Noch nichts gelöst."; // show a short message instead
} // end of the check

// 5. The "Pay 10 points" button
document.getElementById("pay-button").addEventListener("click", () => { // runs when the button is clicked
  if (points < PRICE) { // not enough points to pay
    document.getElementById("pay-message").textContent = `Du brauchst ${PRICE} Punkte, du hast ${points}.`; // explain why nothing happens
    return; // stop here: no paying, no game
  } // end of the check

  localStorage.setItem("totalPoints", total); // make sure the total is saved before we take points away

  let toPay = PRICE; // points still to take away
  for (const chapter of Object.keys(progress)) { // go through the chapters in order: 1, 2, 3, ...
    const taken = Math.min(progress[chapter], toPay); // take as much as this chapter has, but not more than we still need
    progress[chapter] -= taken; // remove those points from the chapter
    toPay -= taken; // we now need fewer
    if (toPay === 0) break; // paid in full: stop the loop
  } // end of the loop

  localStorage.setItem("progress", JSON.stringify(progress)); // save the smaller chapter counts
  location.href = "spiel.html"; // go to the game page
}); // end of the button
