/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.liquid',
    './**/*.json',
    './**/*.html',
    // Add other paths as needed
  ],
  important: true, // This applies !important to all Tailwind CSS classes
  theme: {
    extend: {
      fontFamily: {
        'jost': ['Jost', 'sans-serif'],
      },
      height: {
        '48.75rem': '48.75rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
