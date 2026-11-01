# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no framework, no build step (set in CLAUDE.md before init). Hosted on GitHub Pages at https://suphiaz24.github.io/ from the repo `suphiaz24/suphiaz24.github.io`, deployed by `.github/workflows/deploy.yml` on every push to `main`. Asset paths stay relative.

## Users

- **Primary: recruiters and hiring managers** evaluating Suphia Zhang, a mechanical engineering student, for internships and jobs. They skim fast, want to judge their engineering ability from real work, and expect to find a resume quickly.
- **Secondary: peers and the general public**: classmates, project teammates, and other engineers who want to see what they have built, plus anyone curious about their side projects and writing.

## Product Purpose

A personal home on the web that gets Suphia hired and shows they are a mechanical engineer who builds real things. Success means a recruiter quickly understands what they can do and can get to their resume and contact info, while peers find the site memorable enough to share.

## Positioning

The site of a mechanical engineer, not a generic student portfolio. The proof is physical work: designs, fabricated parts, moving machines, and tests shown in video. The owner wants it to be "cool," something that reads as made by an engineer who builds things, while it still serves a recruiter's skim.

## Operating Context

- Recruiters often open it from a resume, LinkedIn, or an application link, frequently on a phone, and decide within seconds whether to dig in.
- Peers arrive from shared links and browse projects and side builds at leisure.
- The owner will keep adding projects, side builds, and blog posts over time, so adding a new entry must be simple in plain HTML.

## Capabilities and Constraints

Planned sections:
- **About / bio**
- **Projects / portfolio**: engineering projects with media and links
- **Side projects / random creations**: informal builds and experiments, separate from the main portfolio
- **Resume / experience**: experience and education history, plus downloadable resume PDFs
- **Writing / blog**: posts added over time

Resume presentation (confirmed): the **Mechanical Engineering** resume is the one primary download button. The Manufacturing and Testing versions sit in a quieter secondary line: "Also tailored for: Manufacturing · Testing".

Breadth of work: design & CAD, manufacturing/fabrication, robotics/mechatronics, and vehicles/energy/thermal ("a lot of things"). No single discipline should be framed as their only focus.

Constraints: fast loading with no heavy dependencies. Video and GIF media must stay lightweight (compressed, lazy-loaded, never autoplaying heavy files above the fold on mobile).

Open decisions:
- Personal bio voice/text and headline: not written by the owner yet ("fill in later"). Facts may be drawn from the resume; a drafted bio must be shown to the owner for approval.
- Whether to list GitHub or other links beyond email and LinkedIn.
- The phone number on the resume stays in the PDF only; do not publish it in page text.

## Brand Commitments

- Name: **Suphia Zhang**.
- The owner explicitly wants the site to feel cool and fitting for a mechanical engineer, not a plain template.

## Evidence on Hand

Resumes (source of truth for facts; Oct 2026 versions):
- `assets/SZhang_Resume_Mechanical_Engineering.pdf` (primary)
- `assets/SZhang_Resume_Manufacturing_Engineering.pdf`
- `assets/SZhang_Resume_Testing_Engineering.pdf`

Facts from the resume: Cornell University, B.S. Mechanical Engineering with a Minor in Aerospace Engineering, Aug 2025 – May 2029; based in Ithaca, NY; email zhangsiya24@gmail.com; LinkedIn linkedin.com/in/suphia-zhang. Awards: Meinig Family Cornell National Scholar, McMullen Scholarship Recipient, McMullen Dean's Scholar (all 2025–26), National First-Generation Recognition Program. Projects and roles:
- **Team Bootleg (NHRL), a side project with a friend**: Mechanical Design Lead on the robot Nibble Newton (Nov 2025 – present), 3 lb beetleweight, OnShape CAD in 6 weeks, 1 oz under the weight limit, machined parts and carbon fiber layups, survived 4 competition matches.
- **Cornell University Physical Intelligence (CUPI)**: Mechanical Design Team Member (Mar 2026 – present), hexapod leg linkages (Fusion 360 and Onshape) and a Velostat taxel-array tactile foot sensor in a 3D-printed TPU housing for Symbiote (UAV + hexapod), Fusion 360, MuJoCo, Arduino/Python.
- **Bio-Inspired Fluid Lab**: Undergraduate Researcher with Dr. Sunghwan Jung (Sep 2026 – present), flapping-wing aerial-aquatic vehicle modeled on MIT's FAAV, Fusion 360 simulation assembly and motion study.
- **ASME Cornell**: Corporate Committee Member (Dec 2025 – present).
- **Double Dragon Restaurant**: Line Cook / Cashier / Staff (2015 – Aug 2026), including repairing commercial kitchen equipment.

Media:
- `assets/media/cupi-foot-sensor-wiring.jpg`: CUPI foot-sensor prototype, basic wiring (RedBoard, breadboard, load cells, force-sensitive resistors). Extracted from `assets/IMG_2431.pdf`.
- `assets/media/cupi-foot-sensor-prototype.mp4` (0.9 MB, 45 s, 16:10): the CUPI foot sensor in a Wokwi Arduino simulation (four sensor inputs plus an HX711 load-cell amp) driving a live Python plot: a foot-pressure heatmap with center of pressure, and estimated pitch/roll over time. This is the strongest foot-sensor clip.
- `assets/media/cupi-foot-sensor-demo.mp4` (6.6 MB, 65 s, vertical): a phone video of the real hardware's Arduino serial monitor streaming pitch, roll, pad compression, and raw FSR readings. The physical sensor is not visible in frame.
- `assets/media/faav-wing-assembly.mp4` (0.6 MB, 9 s, 16:10): Bio-Inspired Fluid Lab Fusion 360 motion study of the flapping-wing crank–gear–linkage assembly, part of reproducing MIT's diving-bird flapping robot (https://news.mit.edu/2026/new-flapping-robot-swims-and-flies-like-diving-bird-0709).
- `assets/media/faav-gear-assembly.mp4` (0.5 MB, 2.5 s loop, 8:7, no audio): later Fusion 360 motion study of the same project, with paired meshing gears, ball bearings, and a crank rod. Cropped from the user's screen recording of 2026-10-21.
- Each video has a matching `-poster.jpg`. Videos are silent (audio stripped). The originals in `assets/` are source files and are not used by the site.

Absences: no combat-robot or flapping-wing media yet, and no CAD renders. Do not fabricate results, metrics, employers, awards, or testimonials beyond the resume.

## Product Principles

1. **Show the work.** Real builds and media prove ability better than adjectives; projects lead, claims follow.
2. **Recruiter-fast, peer-worthy.** Resume, contact, and a summary of what they do are reachable in seconds; depth is there for those who want it.
3. **Engineered, not decorated.** Personality comes from precision and craft that fit a mechanical engineer, not from generic flourish.
4. **Easy to grow.** Adding a project, side build, or post should be a copy-paste of an existing entry.

## Accessibility & Inclusion

WCAG AA as a baseline: semantic HTML, sufficient contrast, visible keyboard focus states, captions or text descriptions for project videos, and respect for `prefers-reduced-motion` for any motion or autoplaying media.
