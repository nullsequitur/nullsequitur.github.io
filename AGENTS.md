# Agent Guidelines for nullsequitur Homepage

This guide provides context, architectural principles, and operational rules for AI agents modifying or extending this codebase.

## 1. Project Architecture

- **Stack**: Vanilla HTML5, CSS3, and modern ES6 JavaScript.
- **No Bundlers / No Build Step**: Do not introduce build tools, bundlers, or transpilers (e.g., Webpack, Vite, Rollup, Babel, Parcel). The site relies strictly on native browser ES modules (`<script type="module">`).
- **Styling**: CSS variables for theming (Catppuccin Mocha and Latte palettes) and responsive layout.
- **Testing**: Jest run with Node's native experimental VM modules (`NODE_OPTIONS=--experimental-vm-modules jest`) and JSDOM.
- **Serving / Deployment**: GitHub Pages directly serves static files from the repository root. Docker/Podman compose runs an Nginx Alpine container for local development.

---

## 2. Virtual Filesystem & Data Source of Truth

- **Single Source of Truth (`js/content.js`)**:
  - All portfolio text, profile data, skills, links, and filesystem structures live inside `siteData` in [`js/content.js`](js/content.js).
  - **Never hardcode portfolio content directly into HTML.**
  - Dynamic cards and terminal queries read from `siteData`.
- **Filesystem Engine (`js/filesystem.js`)**:
  - Manages the in-memory tree defined by `siteData.filesystem`.
  - Provides path resolution (`resolvePath`), node lookup (`getNode`), directory listing (`listDirectory`), directory changes, and type checking (`isDirectory`, `isFile`).
  - Synchronizes terminal location with the tab navigation system in [`js/sections.js`](js/sections.js) via filesystem events.

---

## 3. Command Registry Pattern (`js/commands.js`)

- **Registry Pattern**:
  - Commands are registered in the `commandRegistry` object in [`js/commands.js`](js/commands.js).
  - Each entry defines a `description` and an `execute(args, termContent, outputBlock)` handler function.
  - Active commands are enumerated in `availableCommands`.
- **XSS Prevention & HTML Escaping**:
  - **All user input and dynamic content rendered into the DOM must be HTML-escaped** using `escapeHTML()` (or `textContent`) before insertion.
  - Never inject raw user input, path parameters, or unsanitized strings directly into `innerHTML`.

---

## 4. Development & Contribution Rules

1. **Conventional Commits**:
   - Use standard conventional commit types: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`, `test:`.
2. **Verify Tests**:
   - Always run `npm test` before and after modifying logic. Ensure all tests pass with zero regressions.
   - When adding new commands, filesystem behaviors, or utilities, add corresponding unit tests in `js/*.test.js`.
3. **Minimalism**:
   - Keep code minimal, clean, and idiomatic. Avoid over-engineering or premature abstractions.
