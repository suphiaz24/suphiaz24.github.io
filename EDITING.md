# How to update the site yourself

The site is plain HTML files. When you save a change to the `main` branch on GitHub,
it goes live at https://suphiaz24.github.io/ by itself in about 1–2 minutes
(you can watch it under the repo's **Actions** tab).

## The easy way: edit on github.com

1. Go to https://github.com/suphiaz24/suphiaz24.github.io
2. Click the file you want (for example `index.html`), then the **pencil icon** (Edit).
3. Make your change. Press **Ctrl+F** to find the text you want to change.
4. Click **Commit changes…**, write a short note like "Update bio", and commit to `main`.

**Uploading photos:** open the `assets/media` folder, then **Add file → Upload files**.
Use lowercase names with dashes and no spaces, like `nhrl-robot-match.jpg`.
Keep photos under ~1 MB; phone photos are often 3–5 MB, so shrink them first
(for example at squoosh.app, around 1600 px on the long side).

## Where things live

| What | File |
|---|---|
| Home page: intro, portrait, project cards, side project cards, experience list | `index.html` |
| About page | `pages/about/index.html` |
| Project pages | `pages/projects/*.html` |
| Side project pages | `pages/side-projects/*.html` |
| Experience pages | `pages/experience/*.html` |
| Build logs (Writing) | `pages/writing/*.html` |
| Photos and videos | `assets/media/` |
| Resumes | `assets/SZhang_Resume_*.pdf` (upload a new file with the same name to replace one) |

## Recipes

### Change text (bio, a project description, a bullet)
Find the sentence and type over it. Leave the `<p>`, `<li>` and other tags around it alone.

### Add a photo to a project, side project, or experience page
Upload the photo to `assets/media/`. Then find the `<div class="figs" id="...">` part of the page
(it's where the "Photo slot" boxes are) and replace one placeholder `<figure>…</figure>` with:

```html
<figure class="fig">
  <img src="../../assets/media/your-photo.jpg" alt="Describe what's in the photo" loading="lazy">
  <figcaption><b>Fig. 2</b>Short caption.</figcaption>
</figure>
```

### Add your portrait (home page and About page)
Upload it as `assets/media/portrait.jpg` (a vertical photo works best). The framed portrait
appears in two files. In each one, find the line with `aria-label="Portrait coming soon"` and
replace that whole line with:

- in `index.html`:
  `<img src="assets/media/portrait.jpg" alt="Suphia Zhang" width="800" height="1000">`
- in `pages/about/index.html`:
  `<img src="../../assets/media/portrait.jpg" alt="Suphia Zhang" width="800" height="1000">`

### Edit the About page
It's `pages/about/index.html`: Background, Off the clock, and Quick facts. The short
intro at the top of the home page is in `index.html`.

### Add a new side project (or project)
1. **Make the page:** open `pages/side-projects/nibble-newton.html`, copy all of it,
   then **Add file → Create new file** in `pages/side-projects/` with a name like `desk-lamp.html`.
   Paste, and change the title, the part number (like `SP-02`), the text, and the photos.
2. **Add the card on the home page:** in `index.html`, find `id="side-projects"` and copy one
   `<li> … </li>` card. Change the link (`href="pages/side-projects/desk-lamp.html"`), the title,
   the summary, and the number.

New projects work the same way with `pages/projects/` and the cards under `id="projects"`.
The sidebar list on each page is written out in every file, so add the new page to the
sidebar of its neighbours too, or ask Claude to do that part.

### Add a build log
1. Copy `pages/writing/flapping-wing-first-motion-study.html` into a new file in `pages/writing/`, and change the title,
   the `LOG-` number and date, the summary, the sections, and the photos or videos.
2. In `index.html`, find `id="writing-track"`, copy one `<li> … </li>` card, and put it first (newest on the left).
   Change the link, number, date, title, and the 1–2 sentence summary.

## If something breaks

Every change is saved in history. On GitHub, open the file, click **History**, and you can see
and copy any earlier version. Or ask Claude: "undo my last change to the site".

## Previewing before it goes live (optional)

Editing on github.com publishes right away. If you'd like to check first, ask Claude to start the
local preview at http://localhost:8000/, or open `index.html` from the folder on your computer
by double-clicking it.
