import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        surface: {
          base: 'hsl(var(--surface-base))',
          card: 'hsl(var(--surface-card))',
          'card-hover': 'hsl(var(--surface-card-hover))',
          elevated: 'hsl(var(--surface-elevated))',
          subtle: 'hsl(var(--surface-subtle))',
        },
        /* Canonical NexaPay Brand Orange: #FF7300 */
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FF9138',
          500: '#FF7300', // Canonical Brand Orange
          600: '#E66800', // Hover
          700: '#CC5C00', // Active
          800: '#A34900',
          900: '#7A3700',
          950: '#421D00',
        },
        /* Controlled semantic accents */
        neon: {
          orange: '#FF7300',
          gold: '#F59E0B',
          green: '#10B981',
          cyan: '#06B6D4',
          rose: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'brand': '0 4px 16px -2px rgba(255, 115, 0, 0.3)',
        'brand-lg': '0 8px 28px -4px rgba(255, 115, 0, 0.38)',
        'elevated': '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 115, 0, 0.25)',
        /* Legacy fallback mappings */
        'neon-orange': '0 4px 16px -2px rgba(255, 115, 0, 0.3)',
        'neon-violet': '0 4px 16px -2px rgba(255, 115, 0, 0.25)',
        'neon-gold': '0 4px 16px -2px rgba(245, 158, 11, 0.3)',
        'neon-cyan': '0 4px 16px -2px rgba(6, 182, 212, 0.25)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      screens: {
        'mobile-s': '320px',
        'mobile-m': '375px',
        'mobile-l': '425px',
        'xs': '320px',
        'sm': '640px',
        'tablet': '768px',
        'md': '768px',
        'laptop': '1024px',
        'lg': '1024px',
        'xl': '1280px',
        'laptop-l': '1440px',
        '2xl': '1920px',
        '4k': '2560px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
