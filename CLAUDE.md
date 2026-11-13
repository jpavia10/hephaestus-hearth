<!-- doc-status: current; normative: yes -->
> **Moved (2026-11-13).** Hearth now lives inside the hub: `jpavia10/prometheus-hub`, folder `pillars/hearth/`, live at https://jpavia10.github.io/prometheus-hub/pillars/hearth/ (owner: "Hearth doesnt need an independent repo if its gonna stop you from working on it"). Do not work in this repository; its deck progress, data packs and AI queue were carried over. This site is left as it was.

# Hephaestus Hearth: integrator notes (Claude)

The house: renovation projects, every asset in every room (the inventory), and a floor plan that gets accurate over time. Part of Prometheus (`jpavia10/prometheus-hub`, `pillars.json`). Live: https://jpavia10.github.io/hephaestus-hearth/.

- **Scope (owner, 2026-11-05: "The point of hearth is to track renovations assets im each room or inventory and a spatial layout thats accurate eventually. So lets keep the scope"):** three things only: (1) renovation projects (what was done to which room, when, at what cost, before/after photos), (2) the assets in each room (what it is, where it sits, model, serial, receipt, warranty), (3) the spatial layout (rooms, walls, doors, windows, measured, getting more accurate over time). No price research, building-code lookups, upkeep calendars or shopping math unless the owner asks; every homework task must serve one of the three.
- **Ownership:** Claude integrates (reviews and merges every pull request and every Drive drop file). Grok, Gemini, Muse and ChatGPT contribute through homework (`docs/agents/queues.json`), Drive `Prometheus Hub/Pillars/Hephaestus Hearth/incoming (AI drop files)/` and pull requests on `{ai}/...` branches.
- **Homework:** edit `docs/agents/queues.json` here, then in the hub run `python3 tools/kit/render.py --root /home/user` (every repo cloned side by side) and copy the changed `docs/agents/drive/*.txt` into their Drive docs. Every task names its count, its file, its checks and what makes it not done (owner, 2026-11-05: "Clear measurable objectives not just big idea with poor Implementation").
- **Scoring:** every outside file gets a row in `collaborators/CONTRIBUTOR_SCORES.md` and a note in Drive `Prometheus Hub/{AI folder}/FEEDBACK — {name} (every pillar)`.
- **Log:** a 2-3 line entry in `collaborators/SHARED_LOG.md` after every change.
- **Deploying:** GitHub Pages may not rebuild for pushes made by the Claude GitHub app (it did not on Titan); after pushing `main`, check the Pages run and, if none started, update a file through the GitHub connector.
- **Look:** the Prometheus look shared by every pillar except Titan.
