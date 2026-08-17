---
name: "Sheriyakam"
description: "Premium, high-end design system for domestic and emergency trade services (electricians, HVAC, cabling) featuring modern HSL-inspired palette, deep primary colors, bright glowing accents, and glassmorphic overlay specifications."
version: "1.0.0"
colors:
  primary: "#0a192f"
  accent: "#4f46e5"
  accentGlow: "rgba(79, 70, 229, 0.2)"
  gold: "#eab308"
  danger: "#f43f5e"
  success: "#10b981"
  dark:
    bgPrimary: "#09090b"
    bgSecondary: "#18181b"
    bgTertiary: "#27272a"
    textPrimary: "#ffffff"
    textSecondary: "#a1a1aa"
    textTertiary: "#71717a"
    border: "#27272a"
  light:
    bgPrimary: "#ffffff"
    bgSecondary: "#f8f9fa"
    bgTertiary: "#e9ecef"
    textPrimary: "#09090b"
    textSecondary: "#4b5563"
    textTertiary: "#9ca3af"
    border: "#e4e4e7"
typography:
  fontFamily: "Outfit, Inter, sans-serif"
  h1: { size: "32px", weight: "700" }
  h2: { size: "24px", weight: "700" }
  body: { size: "16px", weight: "400" }
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
rounded:
  sm: "6px"
  md: "12px"
  lg: "18px"
  xl: "24px"
---

## Visual Design System Overview

Sheriyakam is styled with a modern, high-end, dark-first premium trade aesthetic that inspires trust, quality, and quick execution.

### Color Guidelines
- **Primary Brand Navy (`#0a192f`)**: Reserved for brand badges, deep header gradients, and prominent navy accent containers.
- **Vibrant Accent Indigo (`#4f46e5`)**: Used for primary calls-to-action, buttons, status indicators, and selected states. Represents electrical current, energy, and professionalism.
- **Warm Gold (`#eab308`)**: Used for warnings, rating stars, premium badges, and indicators of excellence.
- **Background Tones**:
  - Dark mode relies on deep zinc black (`#09090b`) to provide a sleek base, with cards rendered in `#18181b` and borders in `#27272a`.
  - Light mode provides a clean contrast with `#ffffff` base and light zinc border dividers.

### Glassmorphism & Micro-animations
- All overlays, headers, and floating modals should use a translucent background color (e.g. `rgba(24, 24, 27, 0.85)` in dark mode and `rgba(255, 255, 255, 0.9)` in light mode) paired with subtle `backdrop-filter: blur(20px)`.
- Interactive buttons should scale slightly on hover (`scale(1.02)`) and use smooth spring animations on native platforms.
