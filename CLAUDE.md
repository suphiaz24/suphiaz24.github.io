# Project notes for Claude

- Static personal website: plain HTML/CSS/JS, no framework, no build step.
- Hosted on GitHub Pages and deployed by `.github/workflows/deploy.yml` on every push to `main`.
  New top-level files or folders need to be added to the "Stage site files" step.
- Use relative asset paths (`assets/...`, not `/assets/...`) so the site also works under a `/<repo>/` subpath.
- Frontend design work goes through the Impeccable plugin (`/impeccable ...` commands).
  Design context from `/impeccable init` takes precedence over generic styling choices.
- Goals: a professional look that works on mobile, is accessible (semantic HTML, good contrast,
  keyboard focus states), and loads fast (no heavy dependencies).
