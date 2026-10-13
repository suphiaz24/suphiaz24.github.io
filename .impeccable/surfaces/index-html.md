---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["pages/projects"]
---

# Surface brief: site home + project pages

Scope: `index.html` (home) and `pages/projects/*.html` (one page per project). Visitor mode: Persuade (a recruiter decides and downloads the resume).

Audience and job: recruiters skimming on a phone or a desk; peers browsing builds. Action: download the Mechanical resume (alternates: Manufacturing, Testing). Proof: real media and resume facts only.

Chosen direction: a user-pinned hybrid after two direction rounds and HTML mocks. Base is the Parts Catalog world; home uses small project cards (from the standard mock) that open catalog-format project pages; the Technical Note author/affiliations/contact block is kept as a compact closing block. The user rejected the half-page split cover and the dark instrument-panel world.

## Direction contract

THESIS: A mechanical engineer's work presented as an industrial supply catalog: plain white pages, hairline rules, dense honest spec tables, a part number on every project. Refuses the hero-plus-gradient student portfolio.

OWN-WORLD: White ground, near-black ink #1a1a1a, hairline rules #d9d9d6, one heavy 2px ink rule under the masthead, catalog link blue for part numbers, a single green action colour for resume downloads. Archivo (variable width) for everything: wide-normal for headings, condensed for tables, nav and labels; JetBrains Mono only for data (part numbers, dates, contact rows). Photos grayscale until selected.

STORY: The visitor sees who Suphia is and what they build in one screen, downloads the resume or opens a project, and on a project page reads the description, the media, and the spec table like a catalog listing.

FIRST VIEWPORT: Masthead (name + Mechanical, nav, resume link) over a 2px rule; name as h1 at catalog-heading scale with the bio beside the green resume button and the "Also tailored for" line; immediately below, the category filter and the first row of project cards with part numbers, visible above the fold on desktop.

FORM: User-pinned hybrid of my pick (Parts Catalog, rank 1 of the second hand) with the canon card grid and the Technical Note author block. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: category filter chips that re-sort the catalog in place; the selected or hovered card's photo turns from grayscale to colour.

Unresolved: no media yet for the combat robot or the hexapod legs (honest "media pending" plates); Side builds and Writing sections have no entries yet (honest empty states); the bio is a draft awaiting the owner's edit.
