// ===== GAME PAGE: Pixelflug =====
// You are one black pixel. Tap, click or press Space to fly up a little.
// Gravity pulls you down. Fly through the gaps in the black walls.
//
// All sizes below are in GAME pixels. The canvas is only 60 × 40 of them;
// spiel.css stretches it so each one shows up as a big square on screen.

// ---------- Setup ----------

const canvas = document.getElementById("game");  // the drawing surface
const pen = canvas.getContext("2d");              // the "pen" we draw with
const scoreText = document.getElementById("score");     // where the score number goes
const messageText = document.getElementById("message"); // where "start" / "game over" goes

const WIDTH = canvas.width;   // 60 game pixels wide
const HEIGHT = canvas.height; // 40 game pixels tall

const GRAVITY = 60;      // how fast you speed up falling (game pixels per second, per second)
const FLAP = -18;        // your speed right after a flap (minus = upwards)
const WALL_SPEED = 15;   // how fast the walls move left (game pixels per second)
const WALL_WIDTH = 3;    // each wall is 3 pixels wide
const GAP = 12;          // the hole in each wall is 12 pixels tall
const WALL_SPACING = 22; // distance from one wall to the next

const BIRD_X = 12; // you always stay 12 pixels from the left; the walls come to you

// ---------- The game's state (everything that changes) ----------

let birdY;     // your height (0 = top edge)
let speed;     // your up/down speed
let walls;     // list of walls, each { x, gapTop, passed }
let score;     // walls passed
let state;     // "ready" (waiting for the first tap), "playing" or "over"

function reset() {                  // put everything back to the start
  birdY = HEIGHT / 2;               // start in the middle
  speed = 0;                        // not moving yet
  walls = [];                       // no walls yet
  score = 0;                        // no points yet
  state = "ready";                  // wait for the first tap
  scoreText.textContent = "0";      // show 0
  messageText.textContent = "Tippe oder drücke Leertaste"; // explain how to start
}

function addWall(x) {                                       // make a new wall at position x
  const gapTop = 4 + Math.floor(Math.random() * (HEIGHT - GAP - 8)); // random hole, at least 4px from top and bottom
  walls.push({ x: x, gapTop: gapTop, passed: false });      // add it to the list
}

// ---------- Input: tap, click or Space ----------

function flap() {                          // what one tap does
  if (state === "over") { reset(); return; } // after a crash, a tap starts over
  if (state === "ready") {                 // the very first tap starts the game
    state = "playing";                     // from now on things move
    messageText.textContent = "";          // hide the start text
    addWall(WIDTH);                        // first wall just off the right edge
  }
  speed = FLAP;                            // jump upwards
}

canvas.addEventListener("pointerdown", flap);   // mouse click or finger tap on the game
document.addEventListener("keydown", (event) => { // any key press on the page
  if (event.code !== "Space") return;           // only the Space bar counts
  event.preventDefault();                       // stop Space from scrolling the page
  flap();                                       // fly up
});

// ---------- Moving everything (one small step of time) ----------

function update(seconds) {                       // seconds = time since the last frame
  if (state !== "playing") return;               // nothing moves before the start or after a crash

  speed += GRAVITY * seconds;                    // gravity: fall a bit faster every moment
  birdY += speed * seconds;                      // move by your speed

  for (const wall of walls) wall.x -= WALL_SPEED * seconds; // every wall slides left

  const last = walls[walls.length - 1];          // the newest wall
  if (last.x < WIDTH - WALL_SPACING) addWall(WIDTH); // far enough in: add the next one
  if (walls[0].x < -WALL_WIDTH) walls.shift();   // oldest wall left the screen: forget it

  // Did you pass a wall? +1 point
  for (const wall of walls) {
    if (!wall.passed && wall.x + WALL_WIDTH < BIRD_X) { // the wall is fully behind you
      wall.passed = true;                        // count each wall only once
      score += 1;                                // one more point
      scoreText.textContent = score;             // show it
    }
  }

  // Did you crash?
  const y = Math.round(birdY);                   // the pixel row you are in
  if (y < 0 || y >= HEIGHT) gameOver();          // flew off the top or fell off the bottom
  for (const wall of walls) {
    const insideWall = BIRD_X >= Math.round(wall.x) && BIRD_X < Math.round(wall.x) + WALL_WIDTH; // same columns as the wall
    const insideGap = y >= wall.gapTop && y < wall.gapTop + GAP;                                   // in the hole
    if (insideWall && !insideGap) gameOver();    // hit the black part
  }
}

function gameOver() {                            // the crash
  state = "over";                                // stop moving
  messageText.textContent = `Aus! ${score} Punkte. Tippe für nochmal.`; // show the result
}

// ---------- Drawing ----------

function draw() {
  pen.fillStyle = "#ffc506";                     // yellow (the same as --color-bg)
  pen.fillRect(0, 0, WIDTH, HEIGHT);             // paint over the last picture

  pen.fillStyle = "#000000";                     // black for everything else
  for (const wall of walls) {
    const x = Math.round(wall.x);                // walls sit on whole pixels, so they stay sharp
    pen.fillRect(x, 0, WALL_WIDTH, wall.gapTop); // the part above the hole
    pen.fillRect(x, wall.gapTop + GAP, WALL_WIDTH, HEIGHT - wall.gapTop - GAP); // the part below
  }
  pen.fillRect(BIRD_X, Math.round(birdY), 1, 1); // you: exactly one pixel
}

// ---------- The loop: move, draw, repeat ~60 times a second ----------

let lastTime = performance.now();                // the time of the previous frame, in milliseconds

function loop(now) {                             // the browser calls this before every screen refresh
  const seconds = Math.min((now - lastTime) / 1000, 0.05); // time since last frame; capped so a lag can't teleport you
  lastTime = now;                                // remember for the next frame
  update(seconds);                               // move
  draw();                                        // paint
  requestAnimationFrame(loop);                   // ask to be called again next frame
}

reset();                                         // set up the first round
requestAnimationFrame(loop);                     // start the loop

// ===== end of the game page =====
