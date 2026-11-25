// Theme toggle: "redgray" (default) <-> "gray" (low-color dark theme, blue links),
// plus the minibuffer cursor-blink toggle.
// Loaded in <head> so the saved theme applies before the page paints.
(function () {
  var KEY = "weslington-theme";
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    if (theme === "gray") {
      root.setAttribute("data-theme", "gray");
    } else {
      root.removeAttribute("data-theme");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "gray" ? "#121212" : "#200000");
  }

  apply(saved());

  // Cursor: hidden by default; clicking the minibuffer (bottom bar) turns the
  // blinking cursor on, and clicking again hides it.
  var BLINK_KEY = "weslington-cursor-blink";
  function blinkSaved() {
    try { return localStorage.getItem(BLINK_KEY) === "on"; } catch (e) { return false; }
  }
  function applyBlink(on) {
    root.classList.toggle("no-blink", !on);
  }
  applyBlink(blinkSaved());

  document.addEventListener("DOMContentLoaded", function () {
    apply(saved());
    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";

    function label() {
      var gray = root.getAttribute("data-theme") === "gray";
      button.textContent = "theme: " + (gray ? "gray" : "redgray");
      button.setAttribute("aria-pressed", gray ? "true" : "false");
      button.title = gray ? "Switch to the red theme" : "Switch to the grayscale theme";
    }

    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "gray" ? "redgray" : "gray";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      label();
    });

    label();
    document.body.appendChild(button);

    var minibuffer = document.querySelector(".minibuffer");
    if (minibuffer) {
      minibuffer.setAttribute("role", "button");
      minibuffer.setAttribute("tabindex", "0");
      function blinkLabel() {
        var on = !root.classList.contains("no-blink");
        minibuffer.setAttribute("aria-pressed", on ? "true" : "false");
        minibuffer.setAttribute("aria-label", "Blinking cursor " + (on ? "shown" : "hidden") + ", click to toggle");
        minibuffer.title = on ? "Click to hide the cursor" : "Click to show a blinking cursor";
      }
      function toggleBlink() {
        var on = root.classList.contains("no-blink");
        applyBlink(on);
        try { localStorage.setItem(BLINK_KEY, on ? "on" : "off"); } catch (e) {}
        blinkLabel();
      }
      minibuffer.addEventListener("click", toggleBlink);
      minibuffer.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleBlink(); }
      });
      blinkLabel();
    }
  });
})();
