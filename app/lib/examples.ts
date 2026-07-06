/**
 * Curated example formulas. Each becomes a prerendered landing page at
 * /examples/<slug> carrying real, indexable content (heading, explanation,
 * LaTeX source) plus a deep link that opens the formula in the editor.
 *
 * Plain data only (no JSX / no `~` alias) so it can be imported from the
 * React Router config and the Bun/Node build scripts, which run outside Vite.
 */
export type ExampleMode = "visual" | "text";

export interface Example {
  /** URL slug under /examples/. */
  slug: string;
  /** Human title — drives the <h1> and title stem. */
  name: string;
  /** Short category label (eyebrow). */
  category: string;
  /** 1–2 sentence meta/OG description. */
  description: string;
  /** The LaTeX source. */
  latex: string;
  /** Editor mode the deep link should open in. */
  mode: ExampleMode;
  /** A short indexable explanation paragraph shown on the page. */
  explanation: string;
}

export const EXAMPLES: Example[] = [
  {
    slug: "quadratic-formula",
    name: "Quadratic Formula",
    category: "Algebra",
    description:
      "The quadratic formula in LaTeX — render it live, then export to PNG, SVG, or PDF or copy the source.",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    mode: "visual",
    explanation:
      "The quadratic formula gives the two roots of any equation of the form ax² + bx + c = 0. In LaTeX it combines a fraction (\\frac), a plus-or-minus sign (\\pm), and a square root (\\sqrt) — a compact showcase of the notation you will reuse constantly.",
  },
  {
    slug: "pythagorean-theorem",
    name: "Pythagorean Theorem",
    category: "Geometry",
    description:
      "The Pythagorean theorem a² + b² = c² written in LaTeX, ready to render, share, and export.",
    latex: "a^2 + b^2 = c^2",
    mode: "visual",
    explanation:
      "The Pythagorean theorem relates the two legs of a right triangle to its hypotenuse. The superscripts are produced with the caret (^) operator, one of the first pieces of LaTeX math syntax worth memorising.",
  },
  {
    slug: "euler-identity",
    name: "Euler's Identity",
    category: "Analysis",
    description:
      "Euler's identity e^{iπ} + 1 = 0 in LaTeX — often called the most beautiful equation in mathematics.",
    latex: "e^{i\\pi} + 1 = 0",
    mode: "visual",
    explanation:
      "Euler's identity ties together five fundamental constants — e, i, π, 1, and 0 — in a single line. The exponent uses braces ({...}) so that both i and \\pi sit in the superscript together.",
  },
  {
    slug: "derivative-definition",
    name: "Definition of the Derivative",
    category: "Calculus",
    description:
      "The limit definition of the derivative in LaTeX, with \\lim and \\frac, ready to render and export.",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    mode: "visual",
    explanation:
      "The derivative is defined as the limit of a difference quotient as the step size h approaches zero. Note \\lim_{h \\to 0} for the limit with its subscript condition and \\to for the arrow.",
  },
  {
    slug: "gaussian-integral",
    name: "Gaussian Integral",
    category: "Calculus",
    description:
      "The Gaussian integral of e^{-x²} over the real line equals √π — typeset in LaTeX and ready to export.",
    latex: "\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}",
    mode: "visual",
    explanation:
      "The Gaussian integral underpins the normal distribution. It demonstrates \\int with lower and upper bounds, the infinity symbol \\infty, and a thin space \\, before the differential dx.",
  },
  {
    slug: "basel-sum",
    name: "Basel Problem",
    category: "Series",
    description:
      "The Basel problem — the sum of reciprocal squares equals π²/6 — written in LaTeX with \\sum and \\frac.",
    latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
    mode: "visual",
    explanation:
      "Euler's solution to the Basel problem sums the reciprocals of the squares to π²/6. The \\sum command takes a subscript for the index and a superscript for the upper limit.",
  },
  {
    slug: "standard-deviation",
    name: "Standard Deviation",
    category: "Statistics",
    description:
      "The population standard deviation formula in LaTeX, combining a square root, a fraction, and a summation.",
    latex:
      "\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2}",
    mode: "visual",
    explanation:
      "Standard deviation measures the spread of a data set around its mean μ. This formula nests a summation inside a fraction inside a square root — a good test of how LaTeX groups nested expressions with braces.",
  },
  {
    slug: "binomial-coefficient",
    name: "Binomial Coefficient",
    category: "Combinatorics",
    description:
      "The binomial coefficient “n choose k” in LaTeX using \\binom and factorials — render, share, and export.",
    latex: "\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}",
    mode: "visual",
    explanation:
      "The binomial coefficient counts the ways to choose k items from n. The \\binom command renders the stacked “n choose k” notation, while the factorials use a plain exclamation mark.",
  },
];

/** Build the editor deep link that reconstructs an example formula. */
export function editorHref(example: Example): string {
  const params = new URLSearchParams();
  params.set("formula", example.latex);
  if (example.mode !== "visual") params.set("mode", example.mode);
  return `/?${params.toString()}`;
}

/** Look up an example by slug (undefined if unknown). */
export function findExample(slug: string): Example | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}
