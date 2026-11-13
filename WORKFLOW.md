# Team workflow (2 people)

How we split the project so we can work in parallel, both learn all three
languages (HTML, CSS, JavaScript), and stop running into rejected pushes.

- **A: Wanda**, track "Engine": everything you *interact* with
- **B: ____**, track "World": content, navigation and the overall look

Swap A and B if you prefer. The split matters, not who gets which side.

---

## 1. The idea behind the split

The project has one natural seam: the **data files**. Every definition and
lemma lives in one JSON file (statement tiles, proof steps, exercises...).

- **B** produces that data and builds the pages *around* the items
  (home map, axioms index, header, footer, design).
- **A** builds the machinery that *reads* the data and makes it interactive
  (symbol keyboard, statement builder, learning ladder, progress).

As long as we agree on the shape of the data, we can work in parallel
without touching each other's files.

Both of us write HTML, CSS and JavaScript in every phase. Nobody is
"only the design person" or "only the code person".

---

## 2. Who owns which file

Each file has one owner. You may *read* everything, but you only *change*
files you own. Shared files change only through a pull request that the
other person approves.

```
site/
├── index.html            B   home: the messy map
├── item.html             A   one item page with the ladder
├── axiome.html           B   axioms index
├── fortschritt.html      A   progress page
├── css/
│   ├── tokens.css        SHARED   colours, fonts, spacing scale
│   ├── base.css          B        header, footer, page layout, links
│   ├── item.css          A        item page, tiles, keyboard
│   └── map.css           B        home map
├── js/
│   ├── keyboard.js       A   symbol bank
│   ├── builder.js        A   drag and drop statement builder
│   ├── ladder.js         A   ladder stages, hidden idea
│   ├── progress.js       A   saving progress in the browser
│   ├── examples.js       B   example / counterexample sorting
│   ├── exercises.js      B   exercises dropdown with hints
│   └── map.js            B   home map
└── data/
    ├── SCHEMA.md         SHARED   what an item file must contain
    ├── symbols.json      A        the symbol bank (same in every exercise)
    ├── axioms.json       B        list for the axioms page
    └── items/*.json      B        one file per definition or lemma
```

Repo root: `CLAUDE.md` and `WORKFLOW.md` are **SHARED**.

Note: the Phase 1 page currently lives at `site/index.html`. A moves it with
`git mv site/index.html site/item.html` so B can build the home page there.

---

## 3. Git rules

The rejected pushes happened because we both pushed to `main` directly.
From now on, `main` is only changed through pull requests.

### Setup (once)

```
git config pull.rebase true
git config --global core.editor "code --wait"
```

On GitHub: Settings → Branches → add a rule for `main` that requires a pull
request before merging. Then nobody can push to `main` by accident.

### Every piece of work

```
git switch main
git pull                                  # 1. start from the latest main
git switch -c a/symbol-keyboard           # 2. new branch: your letter/topic
# ... work, save, test with Live Server ...
git add .
git commit -m "Add first row of symbol keyboard"   # 3. small commits, often
git push -u origin a/symbol-keyboard      # 4. upload your branch
```

5. On GitHub, open a **pull request** from your branch into `main`.
6. The other person reviews it (see section 5) and clicks **Merge**.
7. Both run `git switch main` and `git pull`.

Branch names: `a/...` or `b/...` plus a short topic, for example
`b/axioms-page` or `a/progress-saving`.

Keep branches small: one feature, merged within a day or two. Long-lived
branches are where painful conflicts come from.

---

## 4. Phase plan

**SYNC** = do this together (in person or on a call) before splitting up.

| Phase | Together (SYNC) | A: Engine | B: World |
|---|---|---|---|
| 0 Tools | Both set up Git, VS Code, Live Server | done | Clone repo, same setup |
| 1 HTML | Agree on page list and folder structure | `item.html` (done), `fortschritt.html` | `index.html` skeleton, `axiome.html` with 3-column list |
| 2 CSS | Write `tokens.css` together: the yellow, the dark background, 2 fonts, one spacing scale | `item.css`: tiles, keyboard as arcade control panel | `base.css`: header, nav, footer; style axioms index |
| 3 JS | Explain the DOM to each other with one example | `keyboard.js` + `builder.js`: tap/drag symbols into slots | `examples.js`: sort example vs. counterexample |
| 4 Data | Write `data/SCHEMA.md` together; build item 1 as JSON side by side | Loader: `item.html` builds itself from any item file | Write JSON for items 1 to 5 from the script PDF |
| 5 Ladder | Agree on what "done" means for each stage | `ladder.js` (hidden idea, order steps, justify) + `progress.js` | `exercises.js`: dropdown, tiered hints, solution |
| 6 Map | Agree which items connect (`dependsOn`) | Colour map nodes by progress | `map.js`: the messy connected map |
| 7 Deploy | Launch together | GitHub Pages setup, test the live link | Credits and licence note, README, test on phone and other browsers |
| 8 Later | Decide order of features | Small server + LLM grading | MathLive input, photo upload |

Spaced repetition in Phase 8 is a joint feature: A builds the scheduling,
B decides which questions each item asks on review.

---

## 5. Reviewing each other's pull requests

Review is where most of the learning happens, so take it seriously.

The reviewer:

1. Pulls the branch and tries it in the browser (`git switch b/axioms-page`).
2. Reads every changed line and asks about anything unclear.
3. Leaves at least one comment: a question, a suggestion, or what was good.
4. Approves and merges, or asks for changes.

The author explains one concept from the change to the reviewer.
This replaces the end-of-phase check question: you know you understood
something when you can teach it.

---

## 6. Rhythm

- **Plan:** use GitHub Issues for tasks. One issue per feature, assigned to
  A or B, with the phase as a label. A GitHub Project board (To do,
  Doing, Review, Done) shows who is on what.
- **Weekly sync (15 min):** what got merged, what is next, anything blocking.
  Do the SYNC step of the next phase here.
- **Before changing a SHARED file:** say so in the issue first.
- **Update `CLAUDE.md`** status line at the end of each phase, through a
  pull request like everything else.

---

## 7. When things go wrong

| Message | Meaning | Do |
|---|---|---|
| `rejected ... fetch first` | `main` moved since your last pull | `git pull`, then push again |
| `CONFLICT` | You both changed the same lines | Open the file, keep the right version, `git add`, `git rebase --continue`. Ask the other person if unsure |
| Vim opens | Commit without `-m` | `Esc`, then `:q!` and Enter, then commit with `-m` |
| Not sure what state you're in | | `git status` explains it in plain words |

Never use `git push --force` on `main`.
