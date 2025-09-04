module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        gold: '#ffd700',
        'border-rainbow': 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)'
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', 'cursive', 'system-ui']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
