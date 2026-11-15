// ===== KAPITEL 2: the fun parts of the retro theme =====
// The look is in css/kapitel-2.css. This file adds the things CSS cannot do:
//   1. a title bar with _ □ × on the main window
//   2. the rainbow title
//   3. a tab title that scrolls like a news ticker
//   4. a star trail behind the mouse
//   5. Epsi, the helper in the corner
//   6. a taskbar with your visit count and a clock
// Every part is its own small function, so you can switch one off by
// deleting one line in start() at the bottom.

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches; // true if the visitor asked for less motion

// ----- 1. Title bar -----
function addTitleBar() {
  const main = document.querySelector("main");             // the window
  const bar = document.createElement("div");               // a new, empty <div>
  bar.className = "title-bar";                             // styled in kapitel-2.css
  const title = document.title.split(" – ")[0];            // "Axiome – Analingo" → "Axiome"
  bar.innerHTML = `
    <span>${title}.exe</span>
    <span class="title-bar-buttons">
      <button type="button" aria-label="Minimieren">_</button>
      <button type="button" aria-label="Maximieren">□</button>
      <button type="button" aria-label="Schliessen">×</button>
    </span>`;
  main.prepend(bar);                                       // prepend = put it in as the FIRST child

  const [minimise, maximise, close] = bar.querySelectorAll("button"); // the three buttons, in order
  minimise.addEventListener("click", () => main.classList.toggle("minimised")); // toggle = add the class, or remove it if it is there
  maximise.addEventListener("click", () => main.classList.toggle("maximised"));

  close.addEventListener("click", () => {                  // × hides the window ...
    main.hidden = true;
    const icon = document.createElement("button");         // ... and leaves an icon on the "desktop"
    icon.className = "desktop-icon";
    icon.textContent = `${title}.exe`;
    icon.addEventListener("click", () => {                 // clicking the icon opens the window again
      main.hidden = false;
      icon.remove();
    });
    main.after(icon);                                      // after = put it right behind <main>
  });
}

// ----- 2. Rainbow title -----
// Wraps every letter in its own <span>. The colours come from CSS.
function rainbowTitle() {
  const h1 = document.querySelector("main h1");
  if (!h1) return;                                         // no title: nothing to do
  const text = h1.textContent;
  h1.setAttribute("aria-label", text);                     // screen readers read the word, not single letters
  h1.textContent = "";
  [...text].forEach((letter, i) => {                       // [...text] = the text as a list of letters
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.setProperty("--i", i);                      // tells the CSS which letter this is
    span.setAttribute("aria-hidden", "true");
    h1.append(span);
  });
  h1.classList.add("rainbow");
}

// ----- 3. Scrolling tab title -----
function scrollTabTitle() {
  const message = ` ${document.title} ★`;                  // what scrolls past
  let pos = 0;                                             // where the text starts right now
  setInterval(() => {                                      // setInterval = run this again and again
    document.title = message.slice(pos) + message.slice(0, pos); // cut the text at pos and swap the halves
    pos = (pos + 1) % message.length;                      // % = remainder: back to 0 at the end
  }, 250);                                                 // every 250 milliseconds = 4 times a second
}

// ----- 4. Star trail -----
// Eight little squares. Each frame, every square moves to where the one
// before it was, and the first one jumps to the mouse.
function starTrail() {
  const COLOURS = ["#ffdd00", "#ff66cc", "#66ccff", "#ffffff"];
  const stars = [];
  for (let i = 0; i < 8; i++) {
    const star = document.createElement("div");
    star.className = "trail";
    star.style.background = COLOURS[i % COLOURS.length];   // take turns through the colours
    star.style.opacity = 1 - i / 8;                        // later stars are fainter
    document.body.append(star);
    stars.push({ el: star, x: -100, y: -100 });            // start off screen
  }

  let mouse = { x: -100, y: -100 };
  document.addEventListener("pointermove", (e) => {        // the mouse moved: remember where
    mouse = { x: e.clientX, y: e.clientY };
  });

  function frame() {
    let target = mouse;                                    // the first star follows the mouse
    for (const star of stars) {
      star.x += (target.x - star.x) * 0.5;                 // move halfway towards the target: smooth
      star.y += (target.y - star.y) * 0.5;
      star.el.style.left = `${star.x + 8}px`;              // +8: a little below-right of the pointer
      star.el.style.top = `${star.y + 8}px`;
      target = star;                                       // the next star follows this one
    }
    requestAnimationFrame(frame);                          // do it again on the next screen refresh
  }
  frame();
}

// ----- 5. Epsi, the helper -----
// Tips about using the site (no maths here: maths lives in the data files)
const TIPS = [
  "Hallo! Ich bin Epsi. Klick auf mich für einen neuen Tipp.",
  "Hängst du fest? Unter der Frage gibt es eine «Tipp»-Box.",
  "Mit ⌫ löschst du das letzte Zeichen, mit «Leeren» alles.",
  "Du kannst die Kacheln in der Antwort mit der Maus verschieben.",
  "Dein Fortschritt bleibt nur in diesem Browser gespeichert.",
  "Fahr mal mit der Maus über das A im Logo.",
  "Mit _ □ × oben rechts kannst du das Fenster klein, gross oder zu machen.",
  "Mit «Weiter →» kommst du zum nächsten Axiom.",
];

function addEpsi() {
  const epsi = document.createElement("aside");            // <aside> = a side note, not the main content
  epsi.className = "epsi";
  epsi.innerHTML = `
    <div class="epsi-bubble">
      <p id="epsi-text"></p>
      <button type="button" id="epsi-next">Noch einer</button>
      <button type="button" id="epsi-close">Tschüss</button>
    </div>
    <span class="epsi-face" aria-hidden="true">ε</span>`;
  document.body.append(epsi);

  let tip = 0;
  const text = epsi.querySelector("#epsi-text");
  text.textContent = TIPS[tip];
  function nextTip() {
    tip = (tip + 1) % TIPS.length;                         // next tip, back to the first after the last
    text.textContent = TIPS[tip];
  }
  epsi.querySelector("#epsi-next").addEventListener("click", nextTip);
  epsi.querySelector(".epsi-face").addEventListener("click", nextTip);
  epsi.querySelector("#epsi-close").addEventListener("click", () => (epsi.hidden = true));
  return epsi;                                             // the taskbar needs it to bring Epsi back
}

// ----- 6. Taskbar -----
function addTaskbar(epsi) {
  // Count your own visits to Kapitel 2 pages. try/catch: some browsers
  // block localStorage (private mode), then we just show no number.
  let visits = "";
  try {
    const count = Number(localStorage.getItem("kapitel2Besuche") ?? 0) + 1;
    localStorage.setItem("kapitel2Besuche", count);
    visits = String(count).padStart(6, "0");               // 7 → "000007", like an old hit counter
  } catch {}

  const bar = document.createElement("div");
  bar.className = "taskbar";
  bar.innerHTML = `
    <a href="index.html">▶ Start</a>
    <button type="button" id="epsi-toggle">ε Epsi</button>
    <span class="tray">
      <span class="counter">${visits ? `Besuch Nr. ${visits}` : ""}</span>
      <span id="clock"></span>
    </span>`;
  document.body.append(bar);

  bar.querySelector("#epsi-toggle").addEventListener("click", () => (epsi.hidden = !epsi.hidden)); // show or hide Epsi

  const clock = bar.querySelector("#clock");
  function tick() {
    clock.textContent = new Date().toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" }); // e.g. "14:07"
  }
  tick();                                                  // show the time right away ...
  setInterval(tick, 10000);                                // ... and update it every 10 seconds
}

// ----- Start everything -----
let started = false;
function start() {
  if (started) return;                                     // never build everything twice
  started = true;
  addTitleBar();
  rainbowTitle();
  addTaskbar(addEpsi());                                   // Epsi first, because the taskbar needs it
  if (!calm) {                                             // only with motion allowed:
    scrollTabTitle();
    starTrail();
  }
}

// Kapitel 2 pages have data-kapitel="2" in their HTML. On check.html,
// page.js only sets it after loading the item. A MutationObserver
// watches the <body> and tells us when that attribute changes.
if (document.body.dataset.kapitel === "2") {
  start();
} else {
  new MutationObserver(() => {
    if (document.body.dataset.kapitel === "2") start();
  }).observe(document.body, { attributes: true, attributeFilter: ["data-kapitel"] });
}

// ===== end of KAPITEL 2 =====
