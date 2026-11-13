# Proof Trainer (working title)

A Duolingo-inspired website for learning the definitions, theorems and proofs
of the Analysis script, one item at a time, in the script's own order.

This file is the project's memory. Claude Code reads it automatically at the
start of every session. Update it whenever a decision changes.

## Who it is for

- Anyone working through the script. Public, reachable by link, no accounts.
- Progress is stored in the visitor's own browser.
- The script is open source and only available as a PDF. Credit the authors
  and link the licence on the site.

## How we work (mentoring rules)

The owner is new to HTML, CSS and JavaScript and wants to become an expert.

1. Build in small phases. Never jump ahead.
2. Before any code: explain in plain English why this approach was chosen.
3. After code: break down the key concepts so she can modify it herself.
4. End each phase with one quick question or a tiny, safe task.
5. Guide every step in VS Code on macOS (terminal commands, where to click).
6. Do not generate large amounts of code she has not been taught yet.

## Content model

Two kinds of item, in script order:

- Definition: build the definition, then sort examples and non-examples.
- Lemma or theorem: the full learning ladder below.

Version 1 covers the first five items of the script, chronologically:

1. Definition: injective, surjective, bijective
2. Equivalence relations
3. Lemma 1.52 (functions by case distinction)
4. Next item in the script (to be confirmed from the PDF)
5. Next item in the script (to be confirmed from the PDF)

Each item is one data file (JSON). The site's code never contains maths
content directly.

## Learning ladder (lemmas and theorems)

1. Build the statement from symbol tiles, given the name or a short description.
2. Break the theorem: which hypothesis fails in a given counterexample?
3. Core idea in one sentence. Hidden by default, revealed with one click.
   Record whether it was revealed.
4. Order the shuffled proof steps.
5. Justify each step (definition, earlier lemma, or hypothesis).
6. Reconstruct the idea, later the proof, in your own words.

Nothing is ever locked. Users can skip, peek and jump anywhere.

## Exercises

Each lemma has a dropdown with its additional exercises (Exercise 1, 2, 3...).
Each exercise has tiered hints, then the full solution.

## Input methods

- Symbol keyboard: one large bank of logic and set symbols, organised in tabs
  like an emoji picker. Identical layout in every exercise, so the available
  symbols never give the answer away.
- Drag and drop tiles.
- Maths input field (MathLive), plain-language text, photo upload: later.
- LLM grading: later phase. Grade against stored key ideas, give hints only,
  always show the reference proof, keep the API key on a server.

## Pages

- Home: a slightly messy map connecting all items (what depends on what).
- Item page: the ladder plus the exercises dropdown.
- Axioms: a plain multi-column index of every axiom in the script, as links.
- Progress.

## Visual direction

- Inspired by beigeforce.com: retro arcade, dark background, pixel display
  type with a monospace body font, bold and playful.
- Accent: a yellow, slightly different from the reference site's beige.
- Fun but not overwhelming. Take the spirit, do not copy assets or layout.
- Must not look generic or AI-generated: one accent colour, two typefaces,
  one spacing scale, no stock gradients, no emoji as icons, restrained motion.

## Phases

0. Tools: Node.js, Git, GitHub repo, VS Code extensions- done
1. HTML: structure of one item page
2. CSS: the arcade look, layout, the axioms index
3. JavaScript: symbol keyboard and statement builder
4. Data: items as JSON, generate pages from data
5. Ladder stages 3 to 5, exercises dropdown, saved progress
6. Home map
7. Deployment to a public URL
8. Later: LLM grading, maths input, photo upload, spaced repetition

## Current status

Phase 0 has been done. No website code written yet.
Working on Phase 1
