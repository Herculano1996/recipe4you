import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  /* Font imports — Inter + Playfair Display */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    background-color: #FAFAF8;
    color: #1A1A1A;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Skip navigation link — visible only on focus (WCAG 2.4.1) */
  .skip-link {
    position: absolute;
    top: -100%;
    left: 0;
    padding: 12px 16px;
    background: #E85D26;
    color: #ffffff;
    font-weight: 600;
    text-decoration: none;
    z-index: 9999;
    border-radius: 0 0 8px 0;

    &:focus {
      top: 0;
    }
  }

  /* Screen-reader only utility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Focus rings for non-MUI elements */
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  [tabindex]:focus-visible {
    outline: 3px solid #E85D26;
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Lists without role reset */
  ul[role='list'],
  ol[role='list'] {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  /* Link defaults */
  a {
    color: #E85D26;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: #B84210;
    }
  }
`;
