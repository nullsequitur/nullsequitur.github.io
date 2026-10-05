# nullsequitur Homepage

Personal homepage and portfolio for Lampros Trifyllis. This project features a unique interactive "vi-mode" terminal UI built with vanilla ES6 JavaScript, HTML, and CSS variables.

## Architecture
- **Frontend**: Vanilla HTML5, CSS3 (using CSS variables for theming), and ES6 JavaScript Modules.
- **Testing**: Jest with JSDOM for unit testing the JavaScript logic.
- **Containerization**: Nginx Alpine Docker container for fast local development and testing.
- **CI/CD**: GitHub Actions pipeline that automatically runs Jest tests on every push.

## Local Development Setup

We use Docker (or Podman) to host the project locally. This spins up an Nginx web server and mounts your local files, meaning any changes you make to the HTML/CSS/JS will automatically reflect in the browser upon refresh without needing to rebuild the container.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/getting-started/installation) installed.
- Node.js and npm (if you want to run unit tests locally).

### 1. Serve the site locally
To start the local development server, run:

```bash
docker-compose up -d
```
*(If you use Podman, you can use `podman-compose up -d`)*

Once running, open your browser and navigate to:
**http://localhost:8080**

To stop the server:
```bash
docker-compose down
```

### 2. Running Unit Tests
We use Jest to ensure the terminal logic and commands work as expected.

First, install the dependencies (if you haven't already):
```bash
npm install
```

Then, run the test suite:
```bash
npm test
```

## Deployment
The repository is designed to be hosted natively on **GitHub Pages**. Because the project uses native ES6 modules (`<script type="module">`), no bundler or build step is required. GitHub Pages serves the raw files directly.
