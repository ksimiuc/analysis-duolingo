// The symbol bank: the same in every exercise.
// Later this list moves into a data file.
const SYMBOL_GROUPS = [
  { name: "Quantoren", symbols: ["∀", "∃", "∃!"] },
  { name: "Logik", symbols: ["∧", "∨", "¬", "⇒", "⇔"] },
  { name: "Mengen", symbols: ["∈", "∉", "⊆", "∪", "∩", "∖", "∅", "×"] },
  { name: "Relationen", symbols: ["=", "≠", "<", "≤", ">", "≥", "~"] },
  { name: "Zahlbereiche", symbols: ["ℕ", "ℤ", "ℚ", "ℝ"] },
  { name: "Variablen", symbols: ["x", "y", "x₁", "x₂", "X", "Y", "f", "f(x₁)", "f(x₂)"] },
  { name: "Zeichen", symbols: ["(", ")", "{", "}", ":", ",", "→", "↦"] },
];

// Find the two containers by their agreed ids
const keyboard = document.getElementById("symbol-keyboard");
const answer = document.getElementById("answer-slots");

// 1. Build the keyboard from the list
for (const group of SYMBOL_GROUPS) {
  const label = document.createElement("p");
  label.className = "symbol-group-label";
  label.textContent = group.name;
  keyboard.append(label);

  for (const symbol of group.symbols) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "symbol";
    button.dataset.symbol = symbol;
    button.textContent = symbol;
    keyboard.append(button);
  }
}

// 2. Clicking a symbol adds it as a tile to the answer
keyboard.addEventListener("click", (event) => {
  const button = event.target.closest(".symbol");
  if (!button) return; // the click landed between buttons

  const tile = document.createElement("span");
  tile.className = "tile";
  tile.dataset.symbol = button.dataset.symbol;
  tile.textContent = button.dataset.symbol;
  answer.append(tile);
});

// 3. Clicking a tile removes it again
answer.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");
  if (tile) tile.remove();
});