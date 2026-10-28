(function () {
  "use strict";
  var FLAG_TEXT = {
    photo: "A single flattering photo. Often stolen or stock — save it and reverse-image-search before trusting it.",
    name: "“Captain”, offshore, widower — a job and backstory built to explain why he can never meet, video call, or be checked up on.",
    badge: "A “Verified” badge usually only checks a selfie matches a photo. It proves nothing about who someone really is.",
    fine: "Replying within minutes, any hour, doesn't match someone claiming to be isolated offshore with patchy signal.",
    wifi: "“The rig wifi is not good company” — a built-in excuse for why video calls never quite happen.",
    alone: "“Tired of being alone too” goes straight for loneliness. Real connection takes time; this is designed to feel instant."
  };
  var TOTAL_FLAGS = Object.keys(FLAG_TEXT).length;
  var DURATION = 90;

  function $(id) { return document.getElementById(id); }
  var screens = { intro: $("screen-intro"), profile: $("screen-profile"), message: $("screen-message"), summary: $("screen-summary") };
  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = (k !== name); });
    $("eyebrow").textContent = name === "intro" ? "A 2-minute game" : name === "profile" ? "Find the signs" : name === "message" ? "What would you do?" : "Recap";
  }

  var found = {}, foundN = 0, timer = null, secondsLeft = DURATION;

  function startGame() {
    found = {}; foundN = 0; secondsLeft = DURATION;
    $("foundCount").textContent = "0";
    $("flagpanels").innerHTML = "";
    $("btn-reveal").hidden = true;
    $("btn-toMessage").hidden = true;
    document.querySelectorAll(".hot").forEach(function (h) { h.classList.remove("found-flag"); });
    show("profile");
    tickTimer();
    timer = setInterval(tickTimer, 1000);
  }

  function tickTimer() {
    var pct = Math.max(0, secondsLeft / DURATION);
    $("timeFill").style.transform = "scaleX(" + pct + ")";
    if (secondsLeft <= 0) {
      clearInterval(timer);
      if (foundN < TOTAL_FLAGS) $("btn-reveal").hidden = false;
      $("btn-toMessage").hidden = false;
      return;
    }
    secondsLeft--;
  }

  function flagFound(el, key) {
    if (found[key]) return;
    found[key] = true; foundN++;
    el.classList.add("found-flag");
    $("foundCount").textContent = String(foundN);
    var panel = document.createElement("div");
    panel.className = "flagpanel";
    panel.innerHTML = "<b>Spotted:</b> " + FLAG_TEXT[key];
    $("flagpanels").appendChild(panel);
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (foundN === TOTAL_FLAGS) {
      clearInterval(timer);
      $("btn-toMessage").hidden = false;
      $("btn-reveal").hidden = true;
    }
  }

  document.querySelectorAll(".hot").forEach(function (el) {
    el.addEventListener("click", function () { flagFound(el, el.getAttribute("data-flag")); });
  });

  $("btn-reveal").addEventListener("click", function () {
    document.querySelectorAll(".hot").forEach(function (el) {
      flagFound(el, el.getAttribute("data-flag"));
    });
  });

  $("btn-start").addEventListener("click", startGame);
  $("btn-toMessage").addEventListener("click", function () { show("message"); });

  function choose(kind) {
    $("btn-send").style.display = "none";
    $("btn-stop").style.display = "none";
    var panel = document.createElement("div");
    panel.className = "choice-feedback " + (kind === "good" ? "good" : "bad");
    panel.innerHTML = kind === "good"
      ? "<b>That's exactly right.</b>A request for money — urgent, secretive, from someone you've never met face-to-face — is the single biggest warning sign in any online relationship, whatever the story attached to it."
      : "<b>This is the moment real people lose their savings.</b>There's no customs fee, no hospital bill, no stolen wallet that a genuine partner would ever need you to cover. In real life, this is exactly where to stop.";
    $("choicePanel").innerHTML = "";
    $("choicePanel").appendChild(panel);
    $("btn-toSummary").hidden = false;
  }
  $("btn-send").addEventListener("click", function () { choose("bad"); });
  $("btn-stop").addEventListener("click", function () { choose("good"); });
  $("btn-toSummary").addEventListener("click", function () { show("summary"); });

  $("btn-again").addEventListener("click", function () {
    $("btn-send").style.display = "";
    $("btn-stop").style.display = "";
    $("choicePanel").innerHTML = "";
    $("btn-toSummary").hidden = true;
    show("intro");
  });

  show("intro");
})();
