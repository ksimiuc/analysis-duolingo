// The symbol bank: the same in every exercise.
// Later this list moves into a data file.
const SYMBOL_GROUPS = [
  { name: "Quantoren", symbols: ["∀", "∃", "∃!", "∄"] },
  { name: "Logik", symbols: ["∧", "∨", "¬", "⇒", "⇐", "⇔"] },
  { name: "Mengen", symbols: ["∈", "∉", "⊆", "⊊", "⊇", "∪", "∩", "∖", "∅", "×", "ᶜ", "𝒫", "⋃", "⋂", "|"] },
  { name: "Relationen", symbols: ["=", "≠", "<", "≤", ">", "≥", "~", "≈", "≡", ":="] },
  { name: "Zahlbereiche", symbols: ["ℕ", "ℕ₀", "ℤ", "ℚ", "ℝ", "ℂ"] },
  { name: "Rechnen", symbols: ["+", "−", "·", "/", "√", "!", "∑", "∏", "∞"] },
  { name: "Analysis", symbols: ["lim", "sup", "inf", "max", "min", "→", "↦", "∘", "⁻¹", "∫", "d", "′"] },
  { name: "Griechisch", symbols: ["α", "β", "γ", "δ", "ε", "λ", "μ", "π", "σ", "φ"] },
  { name: "Variablen", symbols: ["a", "b", "c", "x", "x1", "x2", "y", "z", "n", "m", "k", "i", "f", "g", "h", "A", "B", "X", "Y", "Z"] },
  { name: "Indizes", symbols: ["₀", "₁", "₂", "ₙ", "ₖ", "²", "ⁿ"] },
  { name: "Zeichen", symbols: ["(", ")", "[", "]", "{", "}", ":", ",", ";", "…"] },
  { name: "Zahlen", symbols: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] },
{ name: "Funktionen", symbols: ["f(x)", "f(y)", "f(x₁)", "f(x₂)", "g(x)", "f(a)", "f(b)", "f⁻¹"] },
{ name: "Betrag", symbols: ["|", "|x|", "|x−y|", "|f(x)−f(y)|"] },
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
  answer.querySelector(".answer-hint")?.remove();
  answer.append(tile);
});

// 3. Clicking a tile removes it again
answer.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");
  if (tile) tile.remove();
});