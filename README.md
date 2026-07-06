# LaTeX Renderer

A modern web-based LaTeX formula renderer and table editor with live editing, multi-format export, and URL-based sharing.

## Start

Hosted by Github Pages under [latex.quebi.de](https://latex.quebi.de)

## Features

### Formula Editing

- **Visual Mode** — WYSIWYG editing with virtual keyboard using MathLive
- **LaTeX Mode** — Raw LaTeX input for advanced users
- **Live Preview** — Real-time rendering powered by MathJax

### Export Options

- **Raster Formats** — PNG (transparent) and JPG (white background) at high-res (3x) or low-res (1x)
- **Vector Formats** — SVG and PDF export

### Table Editor

- Visual table editing with Lexical
- Support for 11 formats with automatic conversion:
  - LaTeX: `tabular`, `array`, `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix`
  - Programming: MATLAB arrays, Python lists, C++ initializer lists
- Insert/delete rows and columns, toggle borders, set column alignment

### Sharing

- Formulas automatically saved in URL parameters
- Share links that reconstruct the exact formula
- Browser back/forward navigation support

### SEO & Static Generation

- Built with React Router in **SSG mode** (`ssr: false` + `prerender`) — every
  route is prerendered to complete static HTML at build time, so crawlers and
  social/AI scrapers get real content and per-page metadata without running JS.
- The interactive editor is client-gated behind hydration; the prerendered home
  page ships a crawlable intro while the app loads.
- A gallery of example formulas lives at `/examples`, one prerendered landing
  page per formula (`/examples/quadratic-formula`, …) with a deep link that
  opens each one in the editor.
- `sitemap.xml` and `robots.txt` are generated from a single route registry
  (`app/lib/site-routes.ts`) at build time so they never drift.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Tech Stack

- [React](https://react.dev/) — UI framework
- [React Router](https://reactrouter.com/) — Routing + static site generation (SSG)
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Vite](https://vitejs.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — Styling

## Open Source Libraries

This project is built with the following open source libraries:

| Library                                                               | Purpose                     |
| --------------------------------------------------------------------- | --------------------------- |
| [MathLive](https://cortexjs.io/mathlive/)                             | Visual LaTeX formula editor |
| [MathJax](https://www.mathjax.org/)                                   | LaTeX to SVG rendering      |
| [Lexical](https://lexical.dev/)                                       | Rich text table editor      |
| [Three.js](https://threejs.org/)                                      | 3D background effects       |
| [React Three Fiber](https://r3f.docs.pmnd.rs/)                        | React bindings for Three.js |
| [jsPDF](https://github.com/parallax/jsPDF)                            | PDF generation              |
| [svg2pdf.js](https://github.com/yWorks/svg2pdf.js)                    | SVG to PDF conversion       |
| [React Aria Components](https://react-spectrum.adobe.com/react-aria/) | Accessible UI components    |
| [Lucide](https://lucide.dev/)                                         | Icons                       |

## License

MIT
