# Personal Website

A static personal site (plain HTML/CSS/JS, no build step), hosted on GitHub Pages.
The frontend design is built with [Impeccable](https://impeccable.style/).

## Structure

```
index.html              Home page
pages/                  Additional pages (optional)
assets/css/main.css     Styles
assets/js/main.js       Scripts
assets/img/             Images and favicon
.github/workflows/      GitHub Pages deploy workflow
.nojekyll               Tells Pages to skip Jekyll processing
```

## Local preview

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Every push to `main` deploys through `.github/workflows/deploy.yml`.
One-time setup: in the GitHub repo, go to **Settings > Pages > Build and deployment** and set
**Source** to **GitHub Actions**.

If the repo is named `<username>.github.io`, the site is served at `https://<username>.github.io/`.
Any other repo name serves it at `https://<username>.github.io/<repo>/`. Keep asset paths relative
so both work.
