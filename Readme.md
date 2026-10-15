## Q6 — JavaScript behaviour

Files:

- index.html
- index.js
- styles.css
- test.jpeg

### How it works

**1. Adding paragraphs on click.**
The click handler takes the three original paragraphs (marked with class "original"),
clones them with `cloneNode(true)`, strips the "original" class from the clones so
they don't get cloned again on the next click, then shuffles them with a Fisher-Yates
shuffle and appends them after the last paragraph in <main>.

**2. HR separator rule.**
After every second paragraph, if another paragraph follows, an HR is inserted.
This runs on initial load and after every click. The count is against ALL paragraphs
in the DOM, including hidden ones, per the requirement. I recompute the separators
from scratch each time (clear old ones, reapply) rather than incrementally patching,
because incremental patching is where bugs hide.

**3. Toggle button created in JavaScript.**
The toggle button is not in the HTML. It is created by JavaScript and inserted
after the "Hit me" button on load. It toggles a class on every paragraph that
contains an image. The hidden state is stored in a module-level variable, so
when new image paragraphs are added, they inherit the current visibility state
automatically.

### How I checked it

- Loaded the page and confirmed HRs appear between paragraph pairs on load.
- Clicked "Hit me" once. Confirmed three new paragraphs were added in a random order.
- Clicked "Hit me" again. Confirmed six new paragraphs total and HRs recomputed
  correctly at each pair boundary.
- Clicked the toggle button. Confirmed image paragraphs were hidden.
- Clicked "Hit me" while images were hidden. Confirmed the newly added image
  paragraph stayed hidden.
- Clicked the toggle again. Confirmed all image paragraphs (original and clones)
  became visible again.
- Kept clicking "Hit me" and toggling in different orders to check nothing drifted.

### Notes on choices

- I used `p:has(img)` to detect paragraphs containing images. `:has()` is supported
  in all current browsers. If older browser support were required, I'd use a loop
  with `p.querySelector("img")` instead.
- I used Fisher-Yates rather than `array.sort(() => Math.random() - 0.5)` because the
  sort-based approach does not produce a uniform shuffle.
- I handle the separators by clearing and re-applying rather than inserting and
  deleting individual HRs. Simpler to reason about, and the cost is negligible.
- The hidden state is tracked in a single variable, not read from the DOM. This
  means the behaviour is deterministic regardless of what class names happen to
  be applied at any moment.
