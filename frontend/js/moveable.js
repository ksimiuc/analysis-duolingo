// ===== MOVEABLE: drag the tiles around in the answer bar =====
// Everything needed for dragging lives in this file, and only here.
// It is loaded by check.html with type="module", so the names below
// (bar, dragTile, ...) stay private and cannot clash with Keyboard.js.
//
// The idea in three steps:
//   1. Press on a tile         → remember which tile and where you pressed.
//   2. Move the pointer        → once you moved a few pixels, it counts as a drag:
//                                the tile jumps to the spot under your pointer.
//   3. Let go                  → the drag ends. The tile stays where it is now.
//
// "Pointer" means mouse, trackpad finger or touchscreen finger: the browser
// treats all of them the same with pointer events (pointerdown, pointermove, pointerup).

// ---------- Setup ----------

const bar = document.getElementById("answer-slots"); // the answer bar that holds the tiles

const DRAG_DISTANCE = 5; // pixels you must move before a press counts as a drag (smaller = a tap)

let dragTile = null;     // the tile being pressed or dragged; null when nothing is pressed
let startX = 0;          // where the press started, left to right (in pixels)
let startY = 0;          // where the press started, top to bottom (in pixels)
let dragging = false;    // false = just pressed (could still be a tap), true = really dragging
let justDragged = false; // true right after a drag ends, so the click that follows can be ignored

bar.style.touchAction = "none"; // on phones: touching the bar drags tiles instead of scrolling the page
bar.style.userSelect = "none";  // stop the browser from highlighting the symbols as text while dragging

// ---------- 1. Press on a tile ----------

bar.addEventListener("pointerdown", (event) => {      // runs when a pointer presses anywhere in the bar
  const tile = event.target.closest(".tile");          // the tile that was pressed (or null if it was empty space)
  if (!tile) return;                                    // pressed next to the tiles: nothing to drag

  dragTile = tile;                                      // remember the pressed tile
  startX = event.clientX;                               // remember where the press started
  startY = event.clientY;                               // (clientX/clientY = position in the visible window)
  dragging = false;                                     // not a drag yet: it might still be a tap
});

// ---------- 2. Move the pointer ----------
// We listen on the whole document, not just the bar, so the drag keeps
// working even if your pointer slips outside the bar while you drag.

document.addEventListener("pointermove", (event) => { // runs many times per second while the pointer moves
  if (!dragTile) return;                                // nothing is pressed: ignore the movement

  if (!dragging) {                                      // still deciding between tap and drag
    const movedX = event.clientX - startX;              // how far we moved sideways
    const movedY = event.clientY - startY;              // how far we moved up or down
    if (Math.hypot(movedX, movedY) < DRAG_DISTANCE) return; // moved only a little (Pythagoras): still a tap
    dragging = true;                                    // moved far enough: this is now a drag
    dragTile.style.opacity = "0.4";                     // fade the tile so you can see which one you carry
    dragTile.style.cursor = "grabbing";                 // show the "closed hand" cursor
  }

  // Which tile is under the pointer right now?
  const under = document.elementFromPoint(event.clientX, event.clientY); // the topmost element at this point
  const target = under?.closest(".tile");               // the tile it belongs to (?. = skip if nothing is there)
  if (!target || target === dragTile) return;           // over empty space or over itself: leave it where it is
  if (target.parentElement !== bar) return;             // only swap with tiles inside the answer bar

  // Put the dragged tile before or after that tile, depending on which half we are over
  const box = target.getBoundingClientRect();           // the target tile's position and size on screen
  const middle = box.left + box.width / 2;              // the horizontal middle of the target tile
  if (event.clientX < middle) {                         // pointer is on the left half of the target
    target.before(dragTile);                            // move our tile in front of it
  } else {                                              // pointer is on the right half
    target.after(dragTile);                             // move our tile behind it
  }
});

// ---------- 3. Let go ----------

function endDrag() {                                    // shared by "let go" and "cancelled" below
  if (!dragTile) return;                                // nothing was pressed: nothing to clean up
  if (dragging) justDragged = true;                     // a real drag happened: ignore the click that follows
  dragTile.style.opacity = "";                          // "" removes our inline style, so the CSS look returns
  dragTile.style.cursor = "";                           // same for the cursor
  dragTile = null;                                      // forget the tile
  dragging = false;                                     // ready for the next press
}

document.addEventListener("pointerup", endDrag);        // the pointer was released, anywhere on the page
document.addEventListener("pointercancel", endDrag);    // the browser interrupted it (e.g. a phone call, a system gesture)

// ---------- 4. Don't delete the tile after a drag ----------
// Keyboard.js removes a tile when you click it. But letting go after a drag
// also counts as a click, which would delete the tile you just placed.
// "capture: true" makes this listener run BEFORE the one in Keyboard.js,
// so it can stop the click from ever reaching it.

bar.addEventListener("click", (event) => {             // runs for every click in the bar
  if (!justDragged) return;                             // a normal tap: let Keyboard.js delete the tile as usual
  event.stopPropagation();                              // a drag just ended: stop this click here
  justDragged = false;                                  // the next click is a normal one again
}, { capture: true });                                  // capture: run on the way down, before the normal listeners

// ===== end of MOVEABLE =====
