---
name: MindMatch
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c3c6d4'
  on-secondary: '#2c303b'
  secondary-container: '#454954'
  on-secondary-container: '#b5b8c5'
  tertiary: '#ffffff'
  on-tertiary: '#00391a'
  tertiary-container: '#7efba6'
  on-tertiary-container: '#00743c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#dfe2f0'
  secondary-fixed-dim: '#c3c6d4'
  on-secondary-fixed: '#171b25'
  on-secondary-fixed-variant: '#434752'
  tertiary-fixed: '#7efba6'
  tertiary-fixed-dim: '#60de8c'
  on-tertiary-fixed: '#00210d'
  on-tertiary-fixed-variant: '#005229'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is anchored in a high-fidelity, premium dark aesthetic that prioritizes clarity, precision, and a sense of "digital craftsmanship." Inspired by industry leaders like Linear and Apple, the interface utilizes a disciplined "Obsidian" palette where depth is created through tonal layering rather than excessive decoration.

The personality is intellectual, exclusive, and intentional. Every element exists for a reason, utilizing ample whitespace (negative space) to allow the content—compatibility scores and personality insights—to take center stage. The style is a blend of **Minimalism** and **Modern Corporate**, focusing on micro-interactions, crisp borders, and a monochromatic primary palette to evoke a sense of high-end technology and psychological depth.

## Colors

The color strategy employs a "Level-based Surface" system to create hierarchy in a dark environment. 

1.  **Level 0 (Canvas):** `#0F1115` - Used for the deepest background layer.
2.  **Level 1 (Surface):** `#171A21` - Used for structural containers, navigation bars, and grouped content areas.
3.  **Level 2 (Elevated):** `#1D212B` - Specifically for cards and interactive elements that need to pop against the canvas.

The accent color is pure white (`#FFFFFF`), used sparingly for primary actions and key headings to ensure maximum contrast. Status colors (Success, Warning, Error) are desaturated slightly to maintain the premium feel while remaining functional. Borders should utilize low-opacity white transitions rather than solid greys to feel integrated into the dark background.

## Typography

This design system uses **Inter** for all roles to achieve a systematic, neutral, and highly readable feel. 

- **Headings:** Utilize tighter letter-spacing (`-0.02em` to `-0.04em`) and semi-bold/bold weights to create a "locked-in" editorial look.
- **Body:** Kept at functional sizes (14px-16px). Do not exceed 16px for general content to maintain the "handcrafted" and precise aesthetic.
- **Labels:** Use uppercase tracking for metadata and utility labels to create visual distinction without increasing size.
- **Contrast:** Ensure secondary text uses a reduced opacity (approx. 60%) rather than a different font weight to maintain hierarchy.

## Layout & Spacing

The system follows an **8px grid** for vertical rhythm and a **12-column fluid grid** for horizontal layout. 

- **Desktop:** 12 columns, 24px gutters, 64px+ side margins.
- **Tablet:** 8 columns, 20px gutters, 32px side margins.
- **Mobile:** 4 columns, 16px gutters, 20px side margins.

Spacing should be generous to reinforce the premium feel. Use `xl` (40px) or `2xl` (64px) between major sections. Components within a card should strictly adhere to `md` (16px) or `sm` (8px) internal padding to maintain a compact, high-density look.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Outlines:** All cards and buttons must feature a `1px` solid border. Use `rgba(255, 255, 255, 0.08)` for resting states and `rgba(255, 255, 255, 0.2)` for hover/active states.
- **Shadows:** Use a single "Ambient Glow" for the highest elevation level (e.g., Modals or Popovers). 
  - *Shadow Def:* `0 20px 40px rgba(0, 0, 0, 0.4)`. 
- **Inner Borders:** For buttons and primary inputs, use a subtle top-inner-shadow (white at 5% opacity) to simulate a beveled, physical edge—enhancing the "handcrafted" feel.

## Shapes

The shape language is sophisticated and precise. We use **Soft** corners (`0.25rem` to `0.75rem`) to maintain a modern look that isn't overly "bubbly."

- **Small elements (Checkboxes, Inputs):** 4px (`rounded-sm`).
- **Standard elements (Buttons, Chips):** 8px (`rounded-md`).
- **Large containers (Cards, Modals):** 12px (`rounded-lg`).
- **Specialty:** Full round is only permitted for avatar images or status indicators.

## Components

### Buttons
- **Primary:** Solid White background, Black text. No shadow. On hover, reduce opacity to 90%. 
- **Secondary:** Transparent background, 1px border (`border_strong`), White text. On hover, background becomes `rgba(255, 255, 255, 0.05)`.
- **Tertiary/Ghost:** No border, White text at 60% opacity. Hover to 100% opacity.

### Cards
- Background: `#1D212B`.
- Border: `1px solid rgba(255, 255, 255, 0.08)`.
- Padding: `24px`.
- Feature a subtle linear gradient (Top-Left to Bottom-Right) from `rgba(255, 255, 255, 0.02)` to `transparent` to give the surface a slight metallic sheen.

### Input Fields
- Background: `#0F1115` (inset look).
- Border: `1px solid rgba(255, 255, 255, 0.1)`.
- Focus State: Border becomes White, with a `0px 0px 0px 2px rgba(255, 255, 255, 0.1)` outer ring.

### Score Visualizations
- Use **Circular Progress Indicators** with a stroke width of `2px`.
- The track should be `rgba(255, 255, 255, 0.05)`.
- The progress fill should be a clean solid color (Primary White or Success Green).
- Typography inside the circle should be `headline-md`.

### Share Cards
- High-contrast layouts.
- Use a large-scale version of the score visualization.
- Background: Absolute black (`#000000`) to stand out in social feeds, with a prominent white logo.