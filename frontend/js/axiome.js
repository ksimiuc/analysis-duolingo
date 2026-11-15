// ===== AXIOME PAGE =====
// Builds the overview on axiome.html from the data files, so no maths
// is written into the HTML. Three files are read:
//   data/items/index.json    → which ids are axioms, in order
//   data/items/<id>.json     → number and name of each axiom
//   data/axiom-gruppen.json  → the six groups and the source link

const box = document.getElementById("axiom-groups");           // where the groups go

// 1. Which items are axioms?
const index = await fetch("data/items/index.json").then((r) => r.json()); // read the list of all items
const ids = index.items                                        // from all entries ...
  .filter((entry) => entry.type === "axiom")                   // ... keep only the axioms ...
  .map((entry) => entry.id);                                   // ... and keep just their ids

// 2. Load all 16 axiom files at the same time
// Promise.all starts every fetch at once and waits until ALL are done.
// Much faster than loading them one after the other.
const axioms = await Promise.all(
  ids.map((id) => fetch(`data/items/${id}.json`).then((r) => r.json())) // one fetch per id
);

// 3. Load the groups and the source link
const info = await fetch("data/axiom-gruppen.json").then((r) => r.json()); // { hinweis, quelle, gruppen }
document.getElementById("source-link").href = info.quelle;     // credit: link to the script PDF

// 4. The start button goes to the first axiom
document.getElementById("start-button").href = `check.html?id=${ids[0]}`; // e.g. check.html?id=axiom-nullelement

// 5. One block per group: a heading and a list of its axioms
box.textContent = "";                                          // remove "Lädt …"
for (const gruppe of info.gruppen) {                           // e.g. { id: "addition", name: "...", axiome: [1,2,3,4] }
  const section = document.createElement("section");           // a block for this group
  section.className = "axiom-group";                           // styled in kapitel-2.css
  section.innerHTML = `<h2>${gruppe.name}</h2><ol></ol>`;      // heading + empty list
  const list = section.querySelector("ol");                    // the empty list we just made

  for (const axiom of axioms.filter((a) => a.gruppe === gruppe.id)) { // the axioms in this group
    const li = document.createElement("li");                   // one line
    li.innerHTML = `<a href="check.html?id=${axiom.id}">(${axiom.nummer}) ${axiom.name}</a>`; // e.g. "(1) Nullelement"
    list.append(li);                                           // add the line to the list
  }                                                            // end of the axioms in this group

  box.append(section);                                         // add the finished block to the page
}                                                              // end of the groups

// ===== end of the AXIOME page =====
