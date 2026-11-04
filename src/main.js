import { startField } from "./field.js";
import { startHouse } from "./house.js";

const field = document.getElementById("field");
if (field) {
  try {
    startField(field);
    document.documentElement.classList.add("has-gl");
  } catch (error) {
    document.documentElement.classList.add("no-gl");
    console.warn("Particle field unavailable", error);
  }
}

const houseCanvas = document.getElementById("house-canvas");
const resetButton = document.getElementById("reset-view");
const stage = document.getElementById("house-stage");
if (houseCanvas && stage) {
  try {
    const house = startHouse(houseCanvas);
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        house.reset();
        stage.focus();
      });
    }
  } catch (error) {
    stage.classList.add("is-fallback");
    const note = stage.querySelector(".stage-fallback");
    if (note) note.hidden = false;
    console.warn("House view unavailable", error);
  }
}

const links = document.querySelectorAll(".topnav a");
const sections = document.querySelectorAll("#house, #projects, #rooms, #notes");

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    function (entries) {
      const visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      const id = visible.target.id;
      links.forEach(function (link) {
        const on = link.getAttribute("href") === "#" + id;
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { threshold: [0.25, 0.5, 0.75] }
  );
  sections.forEach(function (section) { observer.observe(section); });
}

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {});
  });
}
