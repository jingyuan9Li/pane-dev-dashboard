# Pane — Development Guide

> A tiling browser for developers and indie builders

## Product Summary

Pane is a Chromium-based browser where the primary interface is a persistent tiled canvas of live web panels (not tabs). Users see and interact with multiple dashboards simultaneously, organized into project-based workspaces that persist across sessions.

- **Target user:** Indie developers and solo builders managing multiple web tools per project
- **Anti-user:** Casual browsers, non-technical users, mobile-first users
- **License:** AGPL-3.0 (core), commercial license for enterprise forks
- **Business model:** Free local browser + paid sync tier ($8-10/mo)

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Electron (latest stable, using `WebContentsView` API) |
| Language | TypeScript (strict mode) |
| Chrome UI | React |
| State management | Zustand |
| Storage | SQLite (via `better-sqlite3`) |
| Layout engine | Custom (CSS Grid + pointer events) |
| Build | Electron Forge |
| Testing | Vitest + Playwright |
| Linting | ESLint + Prettier |

### Key Technical Decisions

- **Electron over CEF/Tauri:** WebContentsView is the exact API for this use case. Tauri is disqualified (uses system webview, not Chromium). CEF has better memory but 3-5x dev complexity.
- **SQLite over JSON:** Atomic writes, queryable state, natural migration path to cloud sync.
- **Custom layout engine:** Tiling logic is Pane's core differentiator — no library.
- **React for chrome UI:** Workspace switcher, panel controls, address bars. Not for web content inside panels.
- **Panel hibernation:** Destroy/recreate WebContentsView instances to manage memory. Serialize state to SQLite.

## Architecture Notes

- Each panel is a separate `WebContentsView` instance with full process isolation
- Panel layout engine manages sizing, z-order, and input routing
- Workspace state stored in SQLite; sync layer added later via REST API
- Chrome extension support comes from Electron's Chromium base

## P0 Features (Must Have)

- Tiled panel canvas (default view, not tab bar)
- Drag-to-resize panels with grid snapping
- Named workspaces with independent panel sets
- Persistent sessions (restore on relaunch, per workspace)
- Panel hibernation (suspend inactive panels, reload on focus)
- Click-to-focus with correct input routing

## P1 Features

- Address bar per panel
- Workspace switcher (sidebar + keyboard shortcut)
- Chrome extension support
- Keyboard navigation between panels
- Dark mode (system-aware, dark default)

## Roadmap

- v0.1: Electron shell with 2x2 tiled WebContentsView panels, hardcoded URLs
- v0.2: Draggable/resizable panels, per-panel address bar, keyboard nav
- v0.3: Named workspaces, save/restore layouts, workspace switcher
- v0.4: Hibernation, dark mode, Chrome extension support
- v1.0: Stable release, public launch
- v1.x: Cloud sync backend, paid tier

## Team Context

- Solo founder (CEO/CMO/PM) + AI agent (Claude) builds everything
- Performance is the #1 priority
- No rushing to prototype — build the right foundation
