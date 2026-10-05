# Gemini Agent Rules

- Always use conventional commits (feat, fix, refactor, style, chore, docs, test).
- Never add build tools or bundlers (webpack, vite, babel, etc.). We use native ES modules.
- All text/card content goes through `js/content.js`. Do not hardcode content in HTML.
- All new terminal commands must be registered in `js/commands.js` and use HTML escaping to prevent XSS.
- Always run `npm test` before suggesting or committing logic changes.
