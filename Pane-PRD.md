# Pane — Product Requirements Document

> A tiling browser for developers and indie builders

| Field | Value |
|---|---|
| Version | 0.2 — Stack Finalized |
| Author | Jeff |
| Date | March 2026 |
| License | GNU Affero General Public License v3.0 (AGPL-3.0) |
| Status | In development |

---

## 1. Overview

Pane is a Chromium-based browser with a fundamentally different UI paradigm. Instead of a tab bar, the primary interface is a persistent tiled canvas of live web panels. Users can see and interact with multiple dashboards simultaneously, organized into project-based workspaces that persist across sessions.

The target user is a tech worker or indie developer who routinely monitors multiple web-based tools at once — analytics dashboards, database UIs, social platforms, deployment logs — and finds conventional tab-based navigation a poor fit for this workflow.

---

## 2. Problem Statement

### 2.1 The Tab Bar is the Wrong Metaphor

Modern developers and indie builders don't browse sequentially. They monitor. They need Supabase, Vercel, a social dashboard, and an analytics tool visible simultaneously. The tab bar forces them to choose what to look at rather than letting them see everything at once.

- Arc, Chrome, and Safari all optimize for sequential navigation, not ambient awareness
- Split-screen extensions exist but are bolted-on, not first-class
- OS-level tiling window managers (i3, Hyprland) solve this but require Linux expertise
- No browser treats the tiled canvas as the primary, persistent interface

### 2.2 Target Scenario

A solo developer working on a SaaS product has the following open at all times:

- Supabase table editor and logs
- Vercel deployment status
- Threads or analytics dashboard
- GitHub issues or linear board

Today this requires constant tab switching, losing context with every click. Pane keeps all of these alive and visible on one screen, organized under a single project workspace.

---

## 3. Goals & Non-Goals

### 3.1 Goals

- Replace the tab bar with a persistent, resizable tiled panel canvas
- Support named workspaces that save and restore panel layouts per project
- Feel native and polished — not an extension hack
- Ship a working open source core under AGPL-3.0
- Lay the groundwork for a paid sync/cloud tier

### 3.2 Non-Goals (v1)

- Not a general-purpose browser for casual users
- No built-in email, calendar, or messaging (unlike Vivaldi/Opera)
- No mobile version
- Cloud sync is out of scope for v1 — local only
- No extension marketplace beyond Chrome Web Store compatibility

---

## 4. Target Users

| Segment | Description |
|---|---|
| Primary | Indie developers and solo builders managing multiple web tools per project |
| Secondary | Tech workers (eng, PM, data) who live in dashboards and SaaS tools |
| Anti-user | Casual browsers, non-technical users, mobile-first users |

---

## 5. Feature Requirements

| Feature | Description | Priority |
|---|---|---|
| Tiled panel canvas | Default view is a grid of resizable live web panels, not a tab bar | P0 |
| Drag-to-resize panels | Panels resize via draggable borders; layouts snap to a grid | P0 |
| Named workspaces | Users create workspaces (e.g. 'Bobbin', 'Pane dev') with independent panel sets | P0 |
| Persistent sessions | Panels restore to their last state on relaunch, per workspace | P0 |
| Panel hibernation | Inactive panels suspend to reduce memory usage; reload on focus | P0 |
| Click-to-focus | Clicking into a panel makes it active; keyboard/mouse input routes there | P0 |
| Address bar per panel | Each panel has its own URL bar accessible on focus or hover | P1 |
| Workspace switcher | Quick-switch between workspaces via sidebar or keyboard shortcut | P1 |
| Chrome extension support | Compatible with Chrome Web Store extensions | P1 |
| Keyboard navigation | Navigate between panels with keyboard shortcuts | P1 |
| Dark mode | System-aware dark/light mode, dark default | P1 |
| Panel popout | Expand a single panel to full screen temporarily | P2 |
| Cloud workspace sync | Sync workspaces and layouts across devices (paid tier) | P2 |
| Team workspaces | Share a workspace layout with a team (paid tier) | P3 |

---

## 6. Technical Approach

### 6.1 Foundation

- Built on Chromium via **Electron** (latest stable, using `WebContentsView` API)
- **TypeScript** (strict mode) throughout
- **React** for browser chrome UI (workspace switcher, panel controls, address bars)
- **Zustand** for UI state management
- **SQLite** (via `better-sqlite3`) for workspace/panel persistence
- **Custom layout engine** (CSS Grid + pointer events) — no tiling library
- **Electron Forge** for build/packaging
- **Vitest + Playwright** for testing
- Each panel is a separate `WebContentsView` instance — full process isolation
- Panel layout engine manages sizing, z-order, and input routing
- Workspace state stored in SQLite; sync layer added later via REST API

### 6.2 Key Technical Risks

- **Memory** — multiple live WebContents are expensive; hibernation is critical for usability
- **Input routing** — ensuring click/scroll/keyboard correctly targets the focused panel
- **Chromium updates** — keeping up with upstream security patches
- **Extension compatibility** — some extensions assume single-tab context

### 6.3 Open Source Architecture

- **Core repo** (public, AGPL-3.0): browser shell, tiling engine, local workspaces
- **Cloud repo** (private): sync backend, auth, billing — built as a separate service
- Client communicates with cloud via REST API; license key gates sync features

---

## 7. Business Model

| | |
|---|---|
| Free tier | Full local browser, unlimited panels and workspaces, no account required |
| Paid tier | $8–10/month or $80–100/year |
| Paid features | Workspace sync across devices, cloud backup, future team features |
| License | AGPL-3.0 core; commercial license available for enterprise forks |
| Distribution | Direct download, GitHub, Homebrew cask |

---

## 8. Roadmap

| Milestone | Scope | Target |
|---|---|---|
| v0.1 — Proof of Concept | Electron shell with 2×2 tiled WebContentsView panels, hardcoded URLs | Month 1 |
| v0.2 — Core UI | Draggable/resizable panels, per-panel address bar, basic keyboard nav | Month 2 |
| v0.3 — Workspaces | Named workspaces, save/restore layouts, workspace switcher | Month 3 |
| v0.4 — Polish | Hibernation, dark mode, Chrome extension support, public GitHub | Month 4 |
| v1.0 — Launch | Stable release, Product Hunt launch, direct download | Month 5 |
| v1.x — Sync | Cloud backend, cross-device sync, paid tier launch | Month 7+ |

---

## 9. Success Metrics

- 100 GitHub stars within 30 days of public launch
- 500 active installs within 60 days
- 10 paying subscribers within 90 days of sync launch
- < 2% crash rate on panel WebContents operations
- Positive coverage on Hacker News or equivalent dev community

---

## 10. Open Questions

- **Sites that block embedding** — some dashboards may refuse to load in WebContentsView; needs a mitigation strategy
- **Pricing sensitivity** — $8/month assumption needs validation with target users
