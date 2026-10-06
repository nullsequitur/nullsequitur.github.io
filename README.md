# nullsequitur Terminal Portfolio

**Live at:** [https://nullsequitur.github.io/](https://nullsequitur.github.io/)

An interactive, terminal-first personal portfolio built from scratch for Lampros Trifyllis, a Theoretical Physics PhD and AI Engineer.

The site relies exclusively on vanilla web technologies (HTML5, CSS3, ES6 modules) to create a deeply immersive retro-computing experience. It features a custom virtual filesystem, a command registry, dynamic UI rendering, and accessibility tools.

## Architecture & Features

- **No Build Tools**: Pure ES6 modules (`import/export`) directly in the browser. Zero bundlers (No Webpack, Vite, or Babel).
- **Virtual Filesystem (`js/filesystem.js`)**: A custom tree structure parsed from `js/content.js`. Supports absolute/relative path resolution (`cd ../dir`, `cd ~`) and tab-completion.
- **Command Engine (`js/commands.js`)**: Extensible command registry supporting core Unix-like commands: `whoami`, `ls`, `cd`, `cat`, `pwd`, `clear`.
- **Tab-Replaces-Terminal UX**: Seamless visual switching between the command line interface and visual graphical content cards.
- **Settings TUI**: A fully keyboard-navigable terminal user interface for configuring Catppuccin themes (Mocha/Latte), CRT scanline effects, and cursor styles.

## Local Development

Because the site uses standard ES Modules, it must be served over HTTP/HTTPS (opening `index.html` directly via `file://` will trigger CORS errors). 

1. Install dependencies (only required for local server and testing):
   ```bash
   npm install
   ```

2. Start the local server:
   ```bash
   npm run serve
   ```
   *(This boots a local web server on `http://localhost:8080`. Since there is no build step, you can edit any HTML/CSS/JS file and simply refresh your browser to see changes instantly).*

## Testing

The project uses **Vitest** with JSDOM for blazingly fast, isolated unit testing of the filesystem logic, command routing, state management, and DOM updates.

- **Run all tests once**:
  ```bash
  npm test
  ```
- **Run tests in Watch Mode (for active development)**:
  ```bash
  npm run test:watch
  ```
- **Generate Coverage Report**:
  ```bash
  npm run test:coverage
  ```

## Deployment (GitHub Pages)

The repository uses **GitHub Actions** for CI/CD. 
Whenever code is pushed to the `main` branch, the `.github/workflows/deploy.yml` pipeline automatically triggers:
1. It runs the full Vitest test suite.
2. If all tests pass, it packages the static files and deploys them to GitHub Pages.

**To enable this on a fork or new repository:**
Go to your Repository Settings > Pages > "Build and deployment source" and set it to **"GitHub Actions"**.



---
*Developed locally with the assistance of [Google Antigravity CLI](https://github.com/google/antigravity-cli).*
