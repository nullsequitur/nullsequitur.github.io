# nullsequitur homepage

An interactive, terminal-based personal portfolio for Lampros Trifyllis, Computational Physicist.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Catppuccin theme variables), and ES6 JavaScript Modules.
- **No Bundlers / No Build Step**: Uses native browser ES modules (`<script type="module">`).
- **Testing**: Jest with JSDOM using native ESM support (`NODE_OPTIONS=--experimental-vm-modules`).
- **Containerization**: Nginx Alpine container for local development.
- **CI/CD**: GitHub Actions for automated testing and GitHub Pages deployment.

## Running Locally

You can serve the site locally using Docker or Podman:

```bash
docker-compose up -d
```
*(or `podman-compose up -d`)*

Then open your browser at **http://localhost:8080**.

To stop the container:
```bash
docker-compose down
```

## Running Tests

Unit tests are written with Jest:

```bash
npm install
npm test
```

To run with coverage reporting:
```bash
npm test -- --coverage
```

## Deployment

The site deploys automatically to GitHub Pages via `.github/workflows/deploy.yml` on pushes to the `main` branch.
