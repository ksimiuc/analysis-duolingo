# Content design: item types, exercises and how questions are generated

How the site turns the script's content into exercises without a handwritten
page per exercise. Owner of the data: B. Owner of the code: A. Changes to this
file are agreed together.

Status: proposal, 14 Nov 2026.

---

## 1. What the script contains (Kapitel 1 to 7, about page 400)

Counted from the public 2018/19 edition of the script (Einsiedler, Jossen,
Wieser). The list of all items is in `inventory-draft.json`.

| Kapitel | Axiom | Definition | Lemma | Proposition | Satz | Theorem | Korollar | Total |
|---|---|---|---|---|---|---|---|---|
| 1 Einführung | 1 | 23 | 3 | 3 | 0 | 2 | 0 | 32 |
| 2 Die reellen Zahlen | 16 | 17 | 8 | 3 | 9 | 0 | 3 | 56 |
| 3 Funktionen und die reellen Zahlen | 0 | 7 | 3 | 7 | 5 | 0 | 2 | 24 |
| 4 Das Riemann-Integral | 0 | 9 | 3 | 2 | 6 | 0 | 1 | 21 |
| 5 Folgen und Grenzwerte | 0 | 14 | 12 | 7 | 6 | 1 | 3 | 43 |
| 6 Reihen, Funktionenfolgen, Potenzreihen | 0 | 5 | 6 | 7 | 12 | 0 | 7 | 37 |
| 7 Differentialrechnung | 0 | 3 | 5 | 3 | 5 | 1 | 9 | 26 |
| **Total** | **17** | **78** | **40** | **32** | **43** | **4** | **25** | **239** |

Around these sit roughly 350 Übungen (about 45 marked "Wichtige Übung"),
70 Beispiele, 35 Applets and 20 Bemerkungen.

Caveats:

- The numbers differ between editions. "Funktionen durch Fallunterscheidungen"
  is Lemma 1.67 in the 2018/19 edition and Lemma 1.52 in ours. The names are
  stable, the numbers are not. Our own PDF decides.
- The list was extracted automatically, so a few items are probably missing
  (Kapitel 7 looks thin on definitions). Check it against our PDF.
- The public edition shows no licence notice on its first pages. Confirm the
  licence before the site goes public.

---

## 2. Three groups, by what can be asked

The script uses seven labels, but for the website only three groups behave
differently. Lemma, Proposition, Satz, Theorem and Korollar are logically the
same thing (a statement with a proof); the label only says how important it is.

| Group | Script labels | Has a proof | What it is | What we can ask |
|---|---|---|---|---|
| **axiom** | Axiom | no | A rule we accept as given | Recall it, name it, recognise where it is used, find a structure where it fails |
| **definition** | Definition | no | A new word and its exact meaning | Build it, tell examples from non-examples, negate it, tell it apart from a similar definition |
| **aussage** | Lemma, Proposition, Satz, Theorem, Korollar | yes | "If the hypotheses hold, the conclusion holds" | Recall hypotheses and conclusion, break it by dropping a hypothesis, rebuild and justify the proof |

Attached to an item, never on their own:

- **Beispiel**: material for example and non-example questions.
- **Übung**: goes into the item's exercise dropdown with hints and solution.
  "Wichtige Übung" gets a marker.
- **Bemerkung, Applet**: shown as a note or link, not quizzed.

### Shapes of an Aussage

An optional field `shape` lets the generator pick better questions:

| Shape | Example | Extra question |
|---|---|---|
| `implikation` (default) | Zwischenwertsatz | Which hypothesis fails in this counterexample? |
| `aequivalenz` | Charakterisierungen der Riemann-Integrierbarkeit | Sort statements into equivalent / not equivalent |
| `formel` | Geometrische Summenformel, Kettenregel | Fill the gap in the formula |
| `kriterium` | Leibniz-Kriterium, Quotientenkriterium | Which criterion decides this series? |
| `eindeutigkeit` | Eindeutigkeit des Grenzwerts | Existence, uniqueness, or both? |

A Korollar additionally stores `folgtAus` (the id of its parent), which gives
the question "from which Satz does this follow?".

---

## 3. The fixed set of exercise types

There are only about ten exercise types on the whole site. Each has one
renderer (the code that draws it) and one checker. Hundreds of items reuse them.

| Exercise | What the learner does | Generated from | Extra authoring |
|---|---|---|---|
| `luecke` | Fills one hidden tile | `solutions` | none |
| `bauen` | Builds the statement with the symbol keyboard | `solutions` | none |
| `fehler` | Finds the one wrong tile | `solutions` + shared `mistakes.json` | none |
| `zuordnen` | Matches names to statements | several items of one Kapitel | none |
| `beispiele` | Sorts examples and non-examples | `examples` | the examples |
| `negieren` | Builds the negation | `negation` | the negation |
| `voraussetzungen` | Picks the hypotheses from a list with distractors | `hypotheses` + shared `properties.json` | none |
| `brechen` | Says which hypothesis a counterexample violates | `counterexamples` | the counterexamples |
| `ordnen` | Puts shuffled proof steps in order | `proof.steps` | the steps |
| `begruenden` | Says what justifies a step | `proof.steps[].because` | the reasons |
| `scheitert` | Picks the axiom that fails in a structure | `failsIn` | the structures |

The first four need nothing beyond the statement itself. That is the part that
scales to 239 items.

### Which group gets which exercises

| | axiom | definition | aussage |
|---|---|---|---|
| `luecke` | yes | yes | yes |
| `bauen` | yes | yes | yes |
| `fehler` | yes | yes | yes |
| `zuordnen` | yes | yes | yes |
| `beispiele` | | yes | |
| `negieren` | | yes | |
| `scheitert` | yes | | |
| `voraussetzungen` | | | yes |
| `brechen` | | | yes |
| `ordnen` | | | yes |
| `begruenden` | | | yes |

Order within an item goes from most support to least: `luecke`, then
`fehler`, then `bauen`, then the group's own exercises.

---

## 4. Data format: only the logic

An item file contains facts about the mathematics and no question text.
Three examples (the wording must be taken from our script):

**Axiom**

```json
{
  "id": "axiom-additives-inverses",
  "type": "axiom",
  "kapitel": 2,
  "name": "Additives Inverses",
  "solutions": [["∀", "x", "∈", "ℝ", "∃", "y", "∈", "ℝ", ":", "x", "+", "y", "=", "0"]],
  "failsIn": [{ "structure": "ℕ", "why": "Zu 1 gibt es kein n in ℕ mit 1 + n = 0." }]
}
```

**Definition**

```json
{
  "id": "injektiv",
  "type": "definition",
  "kapitel": 1,
  "name": "Injektiv",
  "setup": "Sei f : X → Y eine Funktion.",
  "solutions": [
    ["∀", "x₁", ",", "x₂", "∈", "X", ":", "f(x₁)", "=", "f(x₂)", "⇒", "x₁", "=", "x₂"],
    ["∀", "x₁", ",", "x₂", "∈", "X", ":", "x₁", "≠", "x₂", "⇒", "f(x₁)", "≠", "f(x₂)"]
  ],
  "negation": [["∃", "x₁", ",", "x₂", "∈", "X", ":", "x₁", "≠", "x₂", "∧", "f(x₁)", "=", "f(x₂)"]],
  "examples": [
    { "text": "f : ℝ → ℝ, f(x) = 2x + 1", "is": true },
    { "text": "f : ℝ → ℝ, f(x) = x²", "is": false, "why": "f(1) = f(−1)" }
  ],
  "confusedWith": ["surjektiv"]
}
```

**Aussage**

```json
{
  "id": "zwischenwertsatz",
  "type": "satz",
  "shape": "implikation",
  "kapitel": 3,
  "name": "Zwischenwertsatz",
  "setup": "Sei f : [a, b] → ℝ eine Funktion und c eine Zahl zwischen f(a) und f(b).",
  "hypotheses": ["stetig"],
  "conclusion": {
    "text": "Es gibt ein x in [a, b] mit f(x) = c.",
    "solutions": [["∃", "x", "∈", "[a, b]", ":", "f(x)", "=", "c"]]
  },
  "counterexamples": [
    { "drops": "stetig", "text": "f(x) = 0 für x < 1 und f(x) = 1 für x ≥ 1 auf [0, 2]: der Wert ½ wird nie angenommen." }
  ],
  "proof": {
    "idea": "Betrachte das Supremum aller Stellen, an denen f noch unter c liegt.",
    "steps": [
      { "id": "s1", "text": "…", "because": "def-supremum" }
    ]
  },
  "dependsOn": ["stetigkeit", "supremum"]
}
```

Two shared files keep authors from repeating themselves:

- `mistakes.json`: typical swaps, used to create wrong tiles
  (`∀` and `∃`, `<` and `≤`, `=` and `≠`, a reversed `⇒`).
- `properties.json`: the pool of properties used as hypotheses and distractors
  (`stetig`, `differenzierbar`, `monoton`, `beschränkt`, `kompakt`, …).

**The one rule that makes partial content safe:** every field except `id`,
`type`, `kapitel` and `name` is optional. An item with only `solutions` already
produces four exercise types. Adding `examples` later switches on one more.

---

## 5. How one page shows everything

```
 item JSON          generators            exercise objects        renderers
 (the logic)   ──►  (item → exercises) ──► { kind, prompt, … } ──► (draw + check)
                         ▲                                              │
                 prompt templates                                       ▼
                 mistakes / properties                        the one <main> in
                                                              interface.html
```

1. `interface.html?item=injektiv` loads `data/items/injektiv.json`.
2. A plan says which exercises its group gets.
3. Each generator reads the item and returns zero or more **exercise objects**:
   plain data that fully describes one question.
4. The page shows them one at a time. For each, the renderer for its `kind`
   builds the HTML elements and checks the answer.

The whole mechanism in outline (teaching sketch, not the final code):

```js
// Which exercises each group gets, in learning order
const PLAN = {
  axiom:      ["luecke", "fehler", "bauen", "scheitert"],
  definition: ["luecke", "fehler", "bauen", "beispiele", "negieren"],
  aussage:    ["voraussetzungen", "luecke", "bauen", "brechen", "ordnen", "begruenden"],
};

// One generator: turns an item into a gap exercise
function luecke(item) {
  const tiles = statementOf(item);        // the first accepted solution
  if (!tiles) return [];                  // item has no tiles yet: no exercise
  const hidden = pickImportantTile(tiles); // prefer ∀ ∃ ⇒ = over brackets
  return [{ kind: "luecke", prompt: fill(PROMPTS.luecke, item), tiles, hidden }];
}

// Every exercise for one item
function exercisesFor(item) {
  return PLAN[groupOf(item.type)].flatMap((name) => GENERATORS[name](item));
}
```

### How the question text is written by code

Each exercise type has a sentence template per group. Placeholders in braces
are filled from the item:

```js
const PROMPTS = {
  bauen: {
    axiom:      "Wie lautet das Axiom «{name}»?",
    definition: "{setup} Baue die Definition: f heisst {name}, wenn …",
    aussage:    "{setup} Baue die Aussage von {label} {nummer} ({name}).",
  },
  luecke: {
    axiom:      "Ein Zeichen fehlt im Axiom «{name}».",
    definition: "Ein Zeichen fehlt in der Definition von «{name}».",
    aussage:    "Ein Zeichen fehlt in {label} {nummer}.",
  },
};
```

`{label}` comes from `type` ("Lemma", "Satz", "Korollar"), so a Korollar is
called a Korollar without anyone typing it. About 25 templates cover every
question on the site. Rewording a question for all items means editing one line.

---

## 6. How HTML, CSS and JavaScript differ per group

**HTML does not differ.** There is one `interface.html` with an empty
container. JavaScript sets two attributes and fills it:

```html
<article id="item" data-group="definition" data-type="definition">
  <p class="item-label">Definition · Kapitel 1</p>
  <h1>Injektiv</h1>
  <div id="exercise"></div>
</article>
```

**CSS differs by one attribute.** The group can change a label or a border,
for example `[data-group="axiom"] .item-label { … }`. Keep it subtle: one
accent colour stays the rule.

**JavaScript differs in one table**, the `PLAN` above. Generators, renderers
and checkers are shared. Adding a new exercise type means: one generator, one
renderer, one template, one line in `PLAN`.

---

## 7. What still has to be written by hand

Code can rearrange knowledge, but it cannot invent it. Per item:

| Automatic | Written by a person |
|---|---|
| Gap, error, build and matching exercises | The statement as tiles, with accepted variants |
| Hypothesis picking with distractors | Examples and non-examples with a reason |
| Shuffling proof steps | The proof cut into steps, with reasons |
| All question wording | Counterexamples, the core idea, hints |

Statements that are mostly words ("f ist stetig auf einem kompakten
Intervall") are handled in two ways: the wordy part goes into `setup` and
`hypotheses`, and only the formal core becomes tiles. The symbol bank also
needs a few word tiles and operators it does not have yet (`+`, `·`, `0`, `1`,
`ε`, `δ`, `|`, `lim`).

Realistic effort: a minimal item (tiles only) takes minutes, a full Satz with
proof steps takes far longer. So the 239 items get filled in layers: first
tiles for everything in a Kapitel, then examples, then proofs for the most
important results.

---

## 8. Who builds what, and in which order

| Step | Together | A (code) | B (content) |
|---|---|---|---|
| 1 | Agree this format; write `injektiv.json` side by side | | |
| 2 | | `luecke` and `bauen`: generator, renderer, checker | Tiles for all Kapitel 1 definitions |
| 3 | | Prompt templates, the page that walks through the exercises | `mistakes.json`, `properties.json` |
| 4 | | `fehler`, `zuordnen` | Examples for Kapitel 1; the 16 axioms |
| 5 | | `beispiele`, `voraussetzungen`, `brechen` | First Aussage in full: Lemma "Funktionen durch Fallunterscheidungen" |
| 6 | | `ordnen`, `begruenden` | Proof steps for further results |
| 7 | | Content check script (tiles exist in the bank, ids match, links resolve) | |