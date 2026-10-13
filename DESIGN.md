---
name: Suphia Zhang · Mechanical Engineering
description: A mechanical engineer's work set as an industrial parts catalog on a drafting sheet, with hairline rules, a part number on every project, and working mechanics.
colors:
  go: "#2e7d32"
  go-dark: "#22612a"
  link: "#1b5e9b"
  caution: "#8a5200"
  fault: "#b3261e"
  ground: "#fafaf8"
  grid-minor: "#ebebe7"
  grid-major: "#dfdfda"
  drawing-line: "#b4b4ae"
  paper: "#ffffff"
  ink: "#1a1a1a"
  ink-2: "#3a3a38"
  steel: "#3a3a38"
  muted: "#5f5f5b"
  control-stroke: "#767672"
  rule: "#d9d9d6"
  wash: "#f4f4f2"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(44px, 6.4vw, 84px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.4vw, 56px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  card-title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  body-long:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  table:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    fontVariation: "\"wdth\" 85"
  spec-line:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
    fontVariation: "\"wdth\" 80"
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.07em"
    fontVariation: "\"wdth\" 78"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0"
rounded:
  none: "0px"
  round: "50%"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "72px"
  gutter: "clamp(16px, 3.2vw, 40px)"
components:
  button-go:
    backgroundColor: "{colors.go}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-go-hover:
    backgroundColor: "{colors.go-dark}"
    textColor: "{colors.paper}"
  filter-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "7px 12px"
  filter-chip-hover:
    backgroundColor: "{colors.wash}"
  filter-chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  sign-plate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "7px 12px"
  sign-plate-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  sign-plate-go:
    backgroundColor: "{colors.go}"
    textColor: "{colors.paper}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.s4}"
  part-number:
    textColor: "{colors.link}"
    typography: "{typography.data}"
  lab-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.s5}"
  callout-pin:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    size: "28px"
  callout-pin-open:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  callout-note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 10px"
    width: "max-content"
  media-pending-plate:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink-2}"
    padding: "{spacing.s4}"
  figure:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "{spacing.s2}"
  masthead:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "96px"
---

# Design System: Suphia Zhang · Mechanical Engineering

## Overview

**Creative North Star: "The Parts Catalog"**

The site presents a mechanical engineer's work as an industrial supply catalog printed on a drafting sheet. The page ground is an off-white grid sheet with a faint blueprint line drawing in the intro. White catalog surfaces sit on top of it: the masthead, cards, spec tables, empty states, lab panels, and the closing block. Every project carries a part number, and every project page reads like a catalog listing: a breadcrumb, a sticky category sidebar, a description, numbered figures, and a dense, honest specifications table. The owner pinned the base as a hybrid. The Parts Catalog world provides the base. The home page uses a grid of small project cards that open catalog-format project pages. The closing block is a Technical Note-style Author / Affiliations / Contact list.

The owner then approved a second layer of working mechanics. The primary nav is a row of signs hung on V-cables from a steel beam, and each sign swings as a damped pendulum. A "Show forces" toggle prints the cable tension in mono. Interactive labs (a two-cable statics lab on the home page and a crank–rocker four-bar on the flapping-wing page) let visitors move real mechanics and read the numbers. Numbered callout pins annotate parts on project photos.

Density is high and type-led. Personality comes from precision and working physics rather than decoration. One variable sans (Archivo) is set wide for headings and condensed for tables, signs, labels, and spec lines, and a monospace is reserved for data. Colour stays functional. Ink sits on white, catalog blue marks part numbers, links, focus, and tension, and green marks the resume download (in lab diagrams it also marks the weight vector and the OK status). The owner explicitly rejected two alternatives: the half-page split cover and the dark instrument-panel world.

**Key Characteristics:**
- An off-white drafting grid ground (20px minor, 100px major) under white catalog surfaces.
- 1px hairline rules, 1px ink rules under section heads (drawn in left to right), and heavy ink rules at the masthead beam and above the closing block.
- Square corners everywhere except the circular callout pins and cable shackles. No shadows except the two callout layers that float over photographs.
- Archivo variable width does all the text work: wide-normal for headings, condensed (78–85%) for tables, signs, labels, and spec lines.
- JetBrains Mono only for data: part numbers, dates, counts, contact rows, forces, and lab readouts.
- A part number on every project card, project page, and spec-table row.
- Motion is physics or drafting: pendulum signs, rules that draw in, cards that rise in, grayscale photos that colour in, and live mechanisms. All of it respects reduced motion.

## Colors

The palette is functional and nearly colourless. Each hue has a narrow, named job.

### Primary
- **Download Green** (`go`, with `go-dark` on hover): the action colour. In the site chrome, it is used only for resume downloads: the filled "Download resume (PDF)" button and the green "Resume" sign in the hanging nav. Inside lab diagrams it is the weight-force arrow and the OK status text. White text on this green passes AA.

### Secondary
- **Catalog Blue** (`link`): part numbers (in mono), in-text links, contact links, "next project" links, the text-selection highlight, the 2px keyboard focus outline, tension arrows and tension readouts on the signs, and the coupler-point path in the four-bar lab.

### Tertiary (lab status only)
- **Caution Amber** (`caution`): the "moving" status in the statics lab.
- **Fault Red** (`fault`): the "bad" or failed status in the labs.

### Neutral
- **Drafting Ground** (`ground`): the page background under everything, tiled with the grid sheet.
- **Grid Minor / Grid Major** (`grid-minor`, `grid-major`): the 20px and 100px lines of the tiled drafting grid.
- **Drawing Line** (`drawing-line`): the faint stroke of the blueprint line drawing in the intro (shown at 45% opacity at 900px and below).
- **Paper** (`paper`): every surface that carries content above the ground, including the masthead, cards, spec tables, empty states, lab panels, figures, callouts, sign plates, and the closing block.
- **Ink** (`ink`): body text, headings, the rule under the beam, the 1px rules under section heads and table heads, card hover borders, the lab panel frame, sign plate frames, callout borders, and pressed fills.
- **Structural Steel** (`steel`): the nav beam, the V-cables, and the cable shackles. It has the same value as Graphite but its own token, because it is a material, not text.
- **Graphite** (`ink-2`): secondary prose, including the lede, card blurbs, descriptions, figure captions, spec lines, and callout legends.
- **Muted Steel** (`muted`): metadata, breadcrumbs, table sub-lines, author-block terms, lab hints and notes, and readout labels.
- **Control Stroke** (`control-stroke`): the 1px border of square toggle and filter controls (filter chips, Show forces, and lab action buttons).
- **Hairline** (`rule`): card borders, table and readout row rules, figure frames, the sidebar divider, and the lab stage divider.
- **Wash** (`wash`): image slots, media-pending plates, and the hover fill on chips and lab buttons.

Single-use values stay out of the token set: the dashed empty-state stroke (#b9b9b5), the near-black video letterbox (#111), and the translucent lab fills.

### Named Rules
**The Green Means Download Rule.** In the site chrome, green appears only on resume downloads. Inside a lab diagram, green is reserved for the weight vector and the OK status. Never use it for tags, decoration, or general success styling.

**The Blue Is Data Rule.** Catalog blue marks part numbers, links, focus, and measured forces. Never use it as a fill or a surface.

**The Paper On Grid Rule.** The drafting grid is the one page ground. Anything a visitor reads sits on a white paper surface on top of it. Never tint individual sections.

## Typography

**Display Font:** Archivo variable (wdth 62–125, wght 100–900), self-hosted, falling back to system-ui
**Body Font:** Archivo (same file)
**Label/Mono Font:** JetBrains Mono 400, self-hosted, falling back to ui-monospace

**Character:** One industrial grotesque carries the whole site by changing its width. Headings are set heavy and tight at normal width. Tables, signs, labels, and spec lines narrow to 78–85% and read like catalog small print. A plain monospace marks the values a catalog or a test rig would print in a code face.

### Hierarchy
- **Display** (800, clamp(44px–84px), 0.95): the owner's name on the home page only.
- **Headline** (800, clamp(34px–56px), 1.0): the project name at the top of a project page.
- **Title** (700, 28px, 1.1): section heads, each sitting on a 1px ink rule. The project-page "Specifications" heading is a 22px/700 step.
- **Card title** (600, 19px, 1.25): project card names.
- **Body** (400, 16px, 1.55): default text. The lede is 17–19px fluid with a 66ch cap.
- **Body long** (400, 17px, 1.6, max 68ch): project descriptions.
- **Table** (400, 14–15px, width 85%): spec tables, lab readouts, lab control labels, and the sidebar.
- **Spec line** (500, 13px, width 80%, +0.02em, tabular figures): the one-line spec summary on each card. It is set in condensed Archivo, not mono.
- **Label** (600, 12–13px, width 78–80%, +0.05–0.14em, uppercase): sign plates (13px, +0.07em; 12px on phones), filter chips, lab buttons and status, the Show forces toggle, table heads, sidebar group heads, author-block terms (12px, +0.14em), and the "Fig. n" figure tag.
- **Data** (JetBrains Mono 400, 11–14px): part numbers, dates, item counts, the contact row, sign tensions (11px), slider outputs, and lab readout values with tabular figures. Lab canvases label forces in mono 12–13px.

### Named Rules
**The Mono Is Data Rule.** Monospace marks values only: part numbers, dates, counts, contact rows, forces, and measurements. Never set prose, headings, labels, instructions, or card spec lines in mono.

**The Width Axis Rule.** Hierarchy comes from Archivo's width and weight, not from extra families. Condense to signal reference matter. Keep headings at normal width.

## Layout

Content sits in one container (1360px max) with a fluid gutter (16–40px). Spacing follows an eight-step scale from 4px to 72px. Sections open with 48px above, and each section head carries a 1px ink rule with 24px below it.

- **Masthead:** a white bar 96px tall. The wordmark is vertically centred. The hanging nav, right-aligned, sits under a 7px steel beam with a 2px ink rule beneath it. On wide screens a small Show forces control sits at the far right. Below 1100px the control is hidden.
- **Home:** the intro is a two-column grid with the blueprint drawing behind it at top right. The name spans the full width above, and the lede (left) sits beside the download block (right). The project cards are a 4-column grid with 24px gaps, dropping to 2 columns at 1100px and 1 at 560px. The statics lab, the experience, education, and capabilities tables, and the Notes empty states follow.
- **Lab panel:** a two-column frame. The canvas stage takes 1.7fr and the control panel takes at least 260px. The stage is at least 420px tall. At 900px and below, the stage stacks above the panel at 340px tall.
- **Project page:** a 220px sticky catalog sidebar beside the article. Under the head, the listing grid places the description beside the spec table (1.1fr / 1fr). Figures follow in an auto-filling row (min 300px).
- **Closing block:** an author definition list beside a repeated download block, on white, under a 2px ink rule.
- **Responsive:** at 900px and below, everything stacks and the sidebar becomes a wrapped project list. At 640px and below, the masthead stops being sticky, and the five signs spread across the full width under the wordmark (76px band, tighter plates). Spec tables restack into labelled rows.

## Elevation & Depth

The system is flat. Rules and white paper over the grid ground create structure: 1px hairlines between items, 1px ink lines under heads, and heavy ink lines at the beam and the colophon. State shows as a border or fill change, not a lift. The current nav sign carries a 3px inset ink bar along its bottom edge. This bar is a rule drawn with an inset shadow, not elevation.

The only real shadows belong to the photo callouts. They float over photographs, where no rule can separate them from the image.

### Shadow Vocabulary
- **Pin lift** (`box-shadow: 0 1px 3px rgba(0, 0, 0, .25)`): numbered callout pins on a photo.
- **Note float** (`box-shadow: 0 4px 14px rgba(0, 0, 0, .18)`): the callout note that opens from a pin.

### Named Rules
**The Ruled Not Raised Rule.** Separate content with rules, borders, and paper on grid. Shadows exist only on callouts layered over a photograph.

## Shapes

Corners are square (0px) on buttons, chips, sign plates, cards, figures, plates, tables, lab panels, and callout notes. Circles (50%) are reserved for physical round parts: the numbered callout pins and the cable shackles where each V-cable hooks onto the beam. Containers are 1px-bordered rectangles. Lab panels and sign plates use an ink border, and catalog items use a hairline. Image slots crop to fixed ratios: 4:3 on cards, 4:5 on project figure stills, and 16:7 on media-pending plates on phones. Empty states use a dashed 1px border to read as "slot reserved".

## Components

### Buttons
Flat, square, and green. The download is the site's one action.
- **Shape:** square corners (0px).
- **Primary (download):** `go` fill, white Archivo 600 16px, 12px × 20px padding, an inline 18px stroke download icon (SVG), and the label "Download resume (PDF)". It is followed by the quieter "Also tailored for: Manufacturing · Testing" line in Muted Steel.
- **Hover / Focus:** the fill steps to `go-dark` over 150ms ease-out. Focus shows the global 2px Catalog Blue outline at a 2px offset.
- **Secondary (lab actions, Show forces):** white, 1px Control Stroke border, uppercase condensed label. Hover fills with Wash. Pressed toggles fill with ink and use white text.

### Chips (filter)
- **Style:** condensed uppercase label (13px, 600, width 78%, +0.05em), white fill, 1px Control Stroke border, 7px × 12px padding, square.
- **State:** hover fills with `wash`. Pressed (`aria-pressed="true"`) fills with ink and uses white text. Chips filter the card grid in place, update the mono item count, and write `?cat=` to the URL.

### Cards / Containers
- **Corner Style:** square.
- **Background:** `paper` on the grid ground, with the image slot on `wash`.
- **Shadow Strategy:** none.
- **Border:** 1px `rule`, turning to `ink` on hover or focus (200ms ease-out).
- **Internal Padding:** 16px. Contents run in this order: 4:3 photo, card title, blurb, spec line (condensed, above a hairline), then a meta row with the mono Catalog Blue part number, the organisation, and mono dates.
- **Photo:** grayscale(1) contrast(1.15) at rest. It returns to full colour on card hover or focus (350ms, cubic-bezier(.16, 1, .3, 1)).
- **Entrance:** cards rise 14px and fade from 55% opacity to full as the grid scrolls into view (800ms, same curve), staggered by 70ms per card.

### Navigation
- **Hanging nav (signature):** five signs (Projects, Experience, Notes, Contact, Resume) hang on V-cables from a 7px steel beam with a 2px ink rule beneath it. Each plate is white with a 1px ink border, 7px × 12px padding, and an uppercase condensed 13px label. Hover inverts the plate to ink with white text. The current page gets a 3px inset ink bar along the bottom. The Resume plate is green. Focus puts the 2px blue outline on the plate.
- **Sign physics:** each sign is a damped pendulum pivoting at its shackle. Signs swing in on load as if just hung. They are pushed by a mouse sweeping across them, and nudged on press and on keyboard focus. Damping scales with the sign mass (heavier signs ring longer).
- **Show forces:** a square toggle reveals each sign's cable tension in 11px mono Catalog Blue below the plate, plus a "Sign mass" slider (0.1–2 kg, mono output). The control is hidden below 1100px.
- **Catalog sidebar (project pages):** uppercase muted group heads, plain stacked links, and the current item underlined and set at 600.
- **Breadcrumb:** 14px Muted Steel, darkening to ink on hover.

### Lab Panel (signature)
A shared white frame with a 1px ink border for interactive mechanics: a canvas stage on the left and a control panel on the right.
- **Stage:** a canvas drawn in system colours. Members and pivots are ink on white, ground and construction lines are dashed Hairline, the beam is steel, tension arrows are Catalog Blue, and the weight arrow is green. Values on the canvas are labelled in mono. The stage is draggable (grab cursor).
- **Controls:** labelled sliders with an ink accent and a mono output aligned right. Below them sits a readout table (muted condensed labels with mono tabular values on hairline rows), square action buttons, and an uppercase condensed status line (OK green, moving Caution Amber, bad Fault Red). A muted 13px note at the bottom states the hand calculation or caveat.
- **Instances:** the two-cable statics lab on the home page (load, anchor spacing, cable stiffness) and the crank–rocker four-bar on the flapping-wing page (link lengths, crank speed, play/pause).

### Spec Table (signature)
This is the catalog listing. Columns are Part no., Description, Process, Material, and Status. The table sits on white. Heads are uppercase condensed labels on a 1px ink rule. Rows are separated by hairlines with 10px cell padding. Part numbers are mono Catalog Blue, and dates are mono with no wrapping. On phones, rows restack into labelled blocks.

### Photo Callouts
Numbered circular pins (28px, white, 1.5px ink ring, mono 13px numeral, pin-lift shadow) sit on a project photo. Activating a pin inverts it to ink and opens a square white note (1px ink border, 13px text, bold part name, note-float shadow, max 220px). The note opens beside the pin and flips left on the right half of the photo. Escape or an outside click closes it. A numbered legend under the figure repeats the parts with mono markers.

### Author Block (signature)
A Technical Note-style definition list in the white colophon. The terms (Author, Affiliations, Contact, Based in) are 12px uppercase condensed Muted Steel labels at +0.14em. The values are 15px Archivo, except the Contact row, which is mono with Catalog Blue links.

### Figures
Each figure is a 1px hairline frame with 8px padding. Captions are 14px Graphite and open with a bold uppercase condensed "Fig. n" tag. Videos have controls, are muted, use `preload="none"` with a poster, are capped at 72vh, and are letterboxed on near-black.

### Media-Pending Plate
When a project has no photo yet, a `wash` plate fills the image slot. It shows the part number in 22px bold mono and a small uppercase "Photo coming" label. It is an honest placeholder, never an invented image.

### Motion
- **Drafting-line reveal:** each section-head rule draws from left to right (scaleX 0 to 1, 1.1s, cubic-bezier(.16, 1, .3, 1)) when it scrolls into view.
- **Card rise:** see Cards.
- **Photo colour-in:** see Cards.
- **Physics:** the pendulum signs and the lab mechanisms run on real dynamics, not keyframes.
- **Reduced motion:** CSS transitions are removed, rules and cards appear already in place, signs hang still, the four-bar starts paused, and the statics lab is critically damped so it settles without oscillating.

## Do's and Don'ts

### Do:
- **Do** give every project a part number and print it in mono Catalog Blue on its card, project page head, and spec rows.
- **Do** keep green for resume downloads in the chrome, and for only the weight vector and OK status inside labs.
- **Do** put anything a visitor reads on white paper above the drafting grid.
- **Do** separate content with 1px `rule` hairlines and 1px ink rules under heads. Reserve the heavy ink rules for the masthead beam and the colophon.
- **Do** set tables, signs, labels, and card spec lines in condensed Archivo (78–85% width).
- **Do** make motion physical or drafted (pendulums, live mechanisms, rules drawing in), and give every animation a reduced-motion state.
- **Do** show forces and measurements in mono with units.
- **Do** use the media-pending plate and dashed empty states when real media or entries don't exist yet.

### Don't:
- **Don't** set prose, headings, labels, instructions, or card spec lines in monospace. Mono is for data only.
- **Don't** add rounded corners to rectangular elements. Circles are for pins and shackles only.
- **Don't** add shadows outside photo callouts, and don't add gradients or tint individual sections.
- **Don't** use green for anything other than resume downloads, the lab weight vector, and the lab OK status, and don't use Catalog Blue as a fill.
- **Don't** add decorative motion that isn't physics, drafting, or the card photo colour-in.
- **Don't** reintroduce the rejected half-page split cover or a dark instrument-panel theme.
