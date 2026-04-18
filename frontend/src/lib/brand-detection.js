/**
 * useBrandDetection
 *
 * Analyses AI-generated output text/diffs for brand-related signals
 * (color values, font names, voice/tone descriptors) and returns
 * a `detected` object if anything actionable is found.
 *
 * Usage:
 *   const { detected, clear } = useBrandDetection(generatedText, currentBrand);
 *
 *   if (detected) → show "Save to brand kit?" banner
 */

// Colour formats we recognise in code/CSS diffs
const HEX_RE     = /#([0-9a-fA-F]{3,8})\b/g;
const RGB_RE     = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
const VAR_COLOR_RE = /(?:color|background(?:-color)?|border(?:-color)?)\s*:\s*([^;}\n]{3,40})/gi;

// Common web-safe / Google-fonts names to look for
const FONT_KEYWORDS = [
  'Inter', 'Roboto', 'Poppins', 'Lato', 'Montserrat', 'Open Sans',
  'Raleway', 'Nunito', 'Source Sans', 'Playfair Display', 'Merriweather',
  'Helvetica', 'Arial', 'Georgia', 'Verdana', 'system-ui', 'sans-serif',
  'monospace', 'serif',
];

function extractColors(text) {
  const colors = new Set();
  let m;
  while ((m = HEX_RE.exec(text)) !== null) {
    const raw = m[0];
    // Only keep 3 or 6 digit hex (not alpha variants to keep it simple)
    if (raw.length === 4 || raw.length === 7) colors.add(raw.toLowerCase());
  }
  // Reset lastIndex
  HEX_RE.lastIndex = 0;
  return [...colors].slice(0, 5); // Cap at 5 to avoid noise
}

function extractFonts(text) {
  return FONT_KEYWORDS.filter((f) =>
    new RegExp(`\\b${f}\\b`, 'i').test(text)
  );
}

/** Returns true if the text appears to discuss brand/style topics */
function hasBrandContext(text) {
  const lower = text.toLowerCase();
  const triggers = [
    'primary color', 'brand color', 'color scheme', 'colour scheme',
    'brand font', 'heading font', 'body font', 'font-family',
    'brand voice', 'tone of voice', 'brand style',
    'logo', 'tagline', 'color palette',
  ];
  return triggers.some((t) => lower.includes(t));
}

/**
 * Analyse AI output text and return a `detected` result if it found
 * meaningful brand signals not already saved to the user's brand kit.
 *
 * @param {string} text    — The full AI response / diff content
 * @param {object} currentBrand  — Project's saved brand object (may be null)
 * @returns {{ colors: string[], fonts: string[], hasBrandContext: boolean } | null}
 */
export function detectBrandSignals(text, currentBrand = {}) {
  if (!text) return null;

  const colors    = extractColors(text);
  const fonts     = extractFonts(text);
  const hasCtx    = hasBrandContext(text);

  // Only flag if we found at least one new color or font, OR explicit brand context
  const newColors = colors.filter((c) => {
    const saved = [
      currentBrand?.primaryColor,
      currentBrand?.secondaryColor,
      currentBrand?.accentColor,
    ].map((s) => s?.toLowerCase());
    return !saved.includes(c);
  });

  const newFonts  = fonts.filter((f) => {
    const saved = [currentBrand?.headingFont, currentBrand?.bodyFont]
      .map((s) => s?.toLowerCase().trim());
    return !saved.includes(f.toLowerCase());
  });

  if (newColors.length === 0 && newFonts.length === 0 && !hasCtx) return null;

  return {
    colors:          newColors,
    fonts:           newFonts,
    hasBrandContext: hasCtx,
    // Suggested prefill for BrandKitCard
    prefill: {
      ...(newColors[0] && !currentBrand?.primaryColor   ? { primaryColor:   newColors[0] } : {}),
      ...(newColors[1] && !currentBrand?.secondaryColor  ? { secondaryColor: newColors[1] } : {}),
      ...(newColors[2] && !currentBrand?.accentColor     ? { accentColor:    newColors[2] } : {}),
      ...(newFonts[0]  && !currentBrand?.headingFont     ? { headingFont:    newFonts[0]  } : {}),
      ...(newFonts[1]  && !currentBrand?.bodyFont        ? { bodyFont:       newFonts[1]  } : {}),
    },
  };
}
