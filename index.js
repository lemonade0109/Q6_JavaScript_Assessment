(function () {
  "use strict";

  const main = document.querySelector("main");
  const addButton = document.getElementById("add-button");
  const IMAGE_HIDDEN_CLASS = "image-hidden";

  // Track whether image paragraphs should be hidden.
  // This lives at the module level so new clones inherit the current state.
  let imagesHidden = false;

  //  Helpers

  function getParagraphs() {
    // All paragraphs inside <main>, excluding the "Hit me" button's container
    // (there isn't one, but this keeps the selector explicit).
    return Array.from(main.querySelectorAll("p"));
  }

  function getOriginalParagraphs() {
    return Array.from(main.querySelectorAll("p.original"));
  }

  // Fisher-Yates shuffle so the randomised order is uniform
  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // HR separator logic

  // Remove all HRs we previously inserted so we can recompute cleanly.
  function clearSeparators() {
    main.querySelectorAll("hr.separator").forEach(function (hr) {
      hr.remove();
    });
  }

  // Apply the rule: after every second paragraph, if another paragraph follows,
  // insert an HR. Counts ALL paragraphs, including hidden ones.
  function applySeparators() {
    clearSeparators();
    const paragraphs = getParagraphs();

    for (let i = 1; i < paragraphs.length - 1; i += 2) {
      // i is the index of every second paragraph (1, 3, 5...).
      // Only insert if another paragraph follows.
      const hr = document.createElement("hr");
      hr.className = "separator";
      paragraphs[i].insertAdjacentElement("afterend", hr);
    }
  }

  //  Image toggle

  function applyImageVisibility() {
    const paragraphsWithImages = main.querySelectorAll("p:has(img)");
    paragraphsWithImages.forEach(function (p) {
      if (imagesHidden) {
        p.classList.add(IMAGE_HIDDEN_CLASS);
      } else {
        p.classList.remove(IMAGE_HIDDEN_CLASS);
      }
    });
  }

  function createToggleButton() {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "toggle-images-button";
    toggle.textContent = "Toggle image paragraphs";
    addButton.insertAdjacentElement("afterend", toggle);

    toggle.addEventListener("click", function () {
      imagesHidden = !imagesHidden;
      applyImageVisibility();
    });
  }

  //  Add button behaviour

  function addClonedParagraphs() {
    const originals = getOriginalParagraphs();
    if (originals.length === 0) return;

    // Clone each original paragraph, strip the "original" class so future
    // clicks only clone the true originals (not previous clones).
    const clones = originals.map(function (p) {
      const clone = p.cloneNode(true);
      clone.classList.remove("original");
      clone.classList.add("clone");
      return clone;
    });

    // Append in randomised order after the last paragraph in <main>.
    const lastParagraph = getParagraphs().pop();
    if (!lastParagraph) return;

    let insertAfter = lastParagraph;
    shuffle(clones).forEach(function (clone) {
      insertAfter.insertAdjacentElement("afterend", clone);
      insertAfter = clone;
    });

    // Newly added image paragraphs must inherit the current hidden state.
    applyImageVisibility();
  }

  // Wiring

  addButton.addEventListener("click", function () {
    addClonedParagraphs();
    applySeparators();
  });

  // On initial load: apply separators once, build the toggle button.
  function init() {
    applySeparators();
    createToggleButton();
    applyImageVisibility();
  }

  init();
})();
