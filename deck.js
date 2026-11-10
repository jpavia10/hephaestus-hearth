/* The Deck Project (Sebastian, 2026-11-10): Joseph's second-floor deck rebuild as a working
   panel inside Hearth — the real spec and his own work sequence, as checkable stages whose
   target dates publish to the Prometheus deadlines bus (same origin: the hub's kit/bus.js).
   State lives in this browser (localStorage "hearth.deck.stages.v1"); checking a stage done
   completes its calendar entry. Blueprint: Revision 7, in Drive (Sebastian/ folder). */
(function () {
  "use strict";
  var STAGES = [
    { id: "paint-left", name: "Paint left side — soffits, roof fascia, window trim, wall" },
    { id: "joists-orange", name: "Sand, prime and paint the exposed joists (orange zone, right of door, near house)" },
    { id: "flashing-right", name: "Replace flashing over the installed board and wall — simple L, trim over it; trim, prime/paint, caulk, install" },
    { id: "flashing-left", name: "Mirror the flashing and trim sequence on the left" },
    { id: "demo-repair", name: "Demo the boards near the house; repair joists — wood filler, butyl joist tape, primer" },
    { id: "first-board", name: "Install the first 11-ft board on the left (board sits on the ledger, sliding under siding and door)" },
    { id: "courses", name: "Lay the remaining courses — 21 total, 2x6x12 staggered butt joints (12+11 / 5+12+6), every joint on framing" },
    { id: "railing", name: "Railing — 4x6 posts, 29-inch 2x4 balusters, cap rails; 2x8 bottom rail already in on the right" }
  ];
  var KEY = "hearth.deck.stages.v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } }
  function publish(id, name, st) {
    if (!window.PB || !st.date) return;
    PB.deadlines.publish({ title: "Deck: " + name, date: st.date, source: "hearth-deck", kind: "project", ref: id, done: !!st.done });
  }
  var root = document.getElementById("deck-stages"); if (!root) return;
  var state = load();
  function paint() {
    var done = STAGES.filter(function (s) { return (state[s.id] || {}).done; }).length;
    root.innerHTML = "";
    var head = document.createElement("p");
    head.className = "dstage-progress";
    head.textContent = done + " of " + STAGES.length + " stages done" + (window.PB ? " · target dates ride the Prometheus calendar" : "");
    root.appendChild(head);
    STAGES.forEach(function (s, i) {
      var st = state[s.id] || {};
      var row = document.createElement("div"); row.className = "dstage";
      var lab = document.createElement("label"); lab.className = "dstage-main";
      var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!st.done;
      cb.addEventListener("change", function () { st.done = cb.checked; state[s.id] = st; save(state); publish(s.id, s.name, st); paint(); });
      var txt = document.createElement("span"); txt.textContent = (i + 1) + ". " + s.name;
      lab.appendChild(cb); lab.appendChild(txt);
      var date = document.createElement("input"); date.type = "date"; date.value = st.date || ""; date.className = "dstage-date"; date.setAttribute("aria-label", "Target date for stage " + (i + 1));
      date.addEventListener("change", function () { st.date = date.value; state[s.id] = st; save(state); publish(s.id, s.name, st); });
      row.appendChild(lab); row.appendChild(date);
      root.appendChild(row);
    });
  }
  STAGES.forEach(function (s) { var st = state[s.id]; if (st && st.date) publish(s.id, s.name, st); });
  paint();
})();
