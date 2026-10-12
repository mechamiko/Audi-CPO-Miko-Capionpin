# Audi Certified Pre-Owned — plain HTML, CSS, JavaScript

Open `index.html` directly in a browser. No build step, framework, package installation, or server is required.

Optional local preview:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8080/.

## Files

Source files use two-space indentation with shared `.editorconfig` and `.prettierrc.json` settings. JavaScript is organized into animation helpers and separate initialization functions for inquiries, scroll reveals, and the vehicle carousel. CSS retains cascade order and responsive overrides while removing obsolete declarations.

- `index.html`: full Audi CPO page from the original Figma frame, `1:3`.
- `card.html`: standalone Audi Hatchbacks card from the later Figma frame, `1:333`.
- `styles.css`: desktop measurements, mobile layouts, and shared styles.
- `script.js`: dialog controls, category selection, keyboard carousel navigation, and local inquiry downloads.
- `assets/`: the 25 unchanged Figma PNG assets and Audi's official variable web font.
- `assets-manifest.json`: local artwork inventory.

## Design fidelity

The requested UI refinement adds more readable body text, restrained red accents, clearer heading hierarchy, subtle gray benefit panels, refined button and form states, and an accessible carousel position indicator. The original Audi artwork, palette, major composition, and section order remain the basis of the design. Warranty details now link to the supplied coverage text rather than referring to an unavailable PDF.

At phone widths (767px and below), content photos use their natural aspect ratios so the complete supplied image is visible. The hero uses a 16:9 frame focused on the car, with a two-line title and a lower subtitle beneath it. Hero and match-banner copy sits below the photo. Both action bars stack all four buttons in one column with full action labels. Warranty and inspection headings use preferred line breaks that can wrap naturally with larger text. Lineup icons sit centrally above their descriptions, image gutters are consistent, and the lineup heading and footnote gaps are reduced. The phone carousel shows one complete card and caps its width at 420px for landscape views.

The desktop layout targets the original 1920px-wide Figma canvas. The full page preserves the original imagery, colors, image crops, copy, and section order. Per the requested carousel adjustment, category cards scroll horizontally at every size and initially show three whole cards on desktop, two on tablets, or one on phones. Touch/trackpad scrolling, the scrollbar, and keyboard arrows navigate the row without previous/next buttons. A position indicator and scroll hint help visitors browse the collection. Card hover states add restrained maroon highlights and a sliding button arrow. Smaller screens also use stacked benefit sections and reflowed lineup rows. No mobile frame was provided, so these responsive layouts are adaptations.

Two fidelity limitations remain: the Figma card buttons use `BMWTypeNext Pro Regular`, which was not supplied; CSS uses that font if installed and otherwise falls back to Audi Type. Figma's proprietary glass effect (17px blur plus refraction and dispersion) is approximated with CSS backdrop blur. A literal pixel-identical rendering is therefore not claimed. Audi Type is the official variable web version; the original design's exact font binaries were not supplied.

The source design is at https://www.figma.com/design/qEhEoSEMBWDcjXLh4KMFhc/Audi-CPO--Practical-1-?node-id=1-3.

Audi's font source: https://static.audi.com/assets/fonts/AudiTypeVF_4.033-EJMP5BQZ.woff2

## Behavior and integration

Motion uses CSS and the native Web Animations API: a one-shot desktop hero entrance, staggered heading and section reveals, subtle photo/card/button hover effects, and dialog enter/exit transitions. Phone photos avoid zoom effects to preserve the full image. Scroll entrances run once with IntersectionObserver; content is visible by default without JavaScript. Reduced-motion preferences disable motion and cancel active JavaScript animations when changed during the session.

Inventory navigation works within the page. The quote, trade, pre-approval, and final inventory actions open an accessible dialog and download an inquiry draft as a text file. They do not submit data, perform credit checks, provide real inventory, or contact a dealership. Replace these actions with the dealership's actual URLs or service integration before production use. No dealership destinations, backend, or warranty PDF were supplied in the design.

## Verification

Checked in Microsoft Edge at 1920, 1440, 1024, 768, 390, and 320 pixels wide. Checks cover loaded artwork, document overflow, text overflow, JavaScript errors, dialog opening/closing, Escape dismissal, trade-field visibility, category selection, and file downloads. Desktop screenshots were visually compared against the Figma export; the standalone card and mobile layout were also inspected. QA tooling and screenshots are isolated in the ignored `.qa/` directory and are not application dependencies.
