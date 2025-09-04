import { useState, useEffect } from 'react'

const themes = {
  beach: {
    name: 'Beach',
    bg: 'bg-gradient-to-br from-blue-200 via-cyan-100 to-yellow-100',
    text: 'text-blue-900',
    card: 'bg-white/80 backdrop-blur-sm border-blue-200',
    header: 'bg-white/90 backdrop-blur-sm border-blue-200',
    accent: 'text-blue-600 hover:text-blue-800'
  },
  space: {
    name: 'Space',
    bg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black',
    text: 'text-white',
    card: 'bg-gray-800/80 backdrop-blur-sm border-purple-500',
    header: 'bg-gray-900/90 backdrop-blur-sm border-purple-500',
    accent: 'text-purple-400 hover:text-purple-300'
  },
  forest: {
    name: 'Amazon Forest',
    bg: 'bg-gradient-to-br from-green-900 via-green-700 to-emerald-800',
    text: 'text-green-100',
    card: 'bg-green-800/80 backdrop-blur-sm border-green-500',
    header: 'bg-green-900/90 backdrop-blur-sm border-green-500',
    accent: 'text-green-300 hover:text-green-200'
  }
}

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('beach')

  useEffect(() => {
    const saved = localStorage.getItem('blog-theme')
    if (saved && themes[saved as keyof typeof themes]) {
      setCurrentTheme(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('blog-theme', currentTheme)
  }, [currentTheme])

  const theme = themes[currentTheme as keyof typeof themes] || themes.beach

  return { currentTheme, theme, setCurrentTheme }
}

export { themes }
