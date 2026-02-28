/**
 * Poppins ERP — Design Tokens
 * Identidad visual de marca
 */

export const theme = {
  colors: {
    // Primarios
    pink:       '#F0197A',
    pinkHover:  '#BE0F61',
    pinkLight:  '#FDF0F7',
    navy:       '#1B1564',
    navyLight:  '#2D25A0',
    navyDark:   '#100D3F',

    // Semánticos
    success:    '#059669',
    warning:    '#D97706',
    error:      '#DC2626',
    info:       '#2563EB',

    // Neutros
    text:       '#111827',
    textSub:    '#6B7280',
    textMuted:  '#9CA3AF',
    border:     '#E5E7EB',
    bgPage:     '#F3F4F6',
    bgCard:     '#FFFFFF',
  },

  fonts: {
    family: "'Poppins', sans-serif",
    weights: {
      light:    300,
      regular:  400,
      medium:   500,
      semibold: 600,
      bold:     700,
      extrabold:800,
    },
  },

  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },

  shadows: {
    card: '0 1px 4px rgba(0,0,0,0.07)',
    modal: '0 20px 60px rgba(0,0,0,0.15)',
  },
};
