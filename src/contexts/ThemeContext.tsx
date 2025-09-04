import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWebLLM } from '../hooks/useWebLLM'

const themes = {
  beach: {
    name: 'Beach',
    bg: 'bg-gradient-to-br from-cyan-200 via-blue-300 to-blue-500',
    backgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
    text: 'text-blue-900',
    card: 'bg-white/85 backdrop-blur-sm border-blue-200',
    header: 'bg-white/90 backdrop-blur-md border-blue-200',
    accent: 'text-blue-600 hover:text-blue-800',
    font: 'font-sans',
    bodyFont: "'Inter', 'Segoe UI', sans-serif",
    textShadow: 'drop-shadow-sm',
    button: 'bg-blue-500 hover:bg-blue-600 text-white',
    overlay: 'bg-blue-50/70'
  },
  autumn: {
    name: 'Autumn',
    bg: 'bg-gradient-to-br from-orange-400 via-red-500 to-amber-600',
    backgroundImage: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    text: 'text-amber-50',
    card: 'bg-amber-900/80 backdrop-blur-sm border-orange-500',
    header: 'bg-orange-900/90 backdrop-blur-md border-orange-500',
    accent: 'text-amber-300 hover:text-amber-200',
    font: 'font-serif',
    bodyFont: "'Playfair Display', 'Georgia', serif",
    textShadow: 'drop-shadow-md',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    overlay: 'bg-orange-900/50'
  },
  space: {
    name: 'Space',
    bg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black',
    backgroundImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
    text: 'text-white',
    card: 'bg-gray-800/80 backdrop-blur-sm border-purple-500',
    header: 'bg-gray-900/90 backdrop-blur-md border-purple-500',
    accent: 'text-purple-400 hover:text-purple-300',
    font: 'font-mono',
    bodyFont: "'JetBrains Mono', 'Courier New', monospace",
    textShadow: 'drop-shadow-lg',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    overlay: 'bg-black/60'
  },
  dark: {
    name: 'Dark Serious',
    bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    backgroundImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    text: 'text-gray-100',
    card: 'bg-gray-800/90 backdrop-blur-sm border-gray-600',
    header: 'bg-black/90 backdrop-blur-md border-gray-700',
    accent: 'text-gray-300 hover:text-white',
    font: 'font-sans',
    bodyFont: "'Inter', 'Segoe UI', sans-serif",
    textShadow: 'drop-shadow-md',
    button: 'bg-gray-700 hover:bg-gray-600 text-white',
    overlay: 'bg-black/70'
  },
  desert: {
    name: 'Desert',
    bg: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600',
    backgroundImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
    text: 'text-amber-900',
    card: 'bg-yellow-100/80 backdrop-blur-sm border-yellow-400',
    header: 'bg-yellow-200/90 backdrop-blur-md border-yellow-500',
    accent: 'text-orange-700 hover:text-red-700',
    font: 'font-serif',
    bodyFont: "'Playfair Display', 'Georgia', serif",
    textShadow: 'drop-shadow-sm',
    button: 'bg-orange-500 hover:bg-orange-600 text-white',
    overlay: 'bg-yellow-200/60'
  },
  pastel: {
    name: 'Pastel',
    bg: 'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200',
    backgroundImage: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2029&q=80',
    text: 'text-gray-700',
    card: 'bg-white/80 backdrop-blur-sm border-pink-200',
    header: 'bg-pink-50/90 backdrop-blur-md border-pink-200',
    accent: 'text-purple-600 hover:text-purple-800',
    font: 'font-sans',
    bodyFont: "'Inter', 'Segoe UI', sans-serif",
    textShadow: 'drop-shadow-sm',
    button: 'bg-pink-400 hover:bg-pink-500 text-white',
    overlay: 'bg-white/40'
  },
  corporate: {
    name: 'Corporate',
    bg: 'bg-gradient-to-br from-slate-800 via-gray-700 to-blue-900',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    text: 'text-slate-100',
    card: 'bg-slate-800/85 backdrop-blur-sm border-slate-600',
    header: 'bg-slate-900/95 backdrop-blur-md border-slate-700',
    accent: 'text-blue-400 hover:text-blue-300',
    font: 'font-sans',
    bodyFont: "'Inter', 'Segoe UI', sans-serif",
    textShadow: 'drop-shadow-md',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    overlay: 'bg-slate-900/60'
  },
  festive: {
    name: 'Festive',
    bg: 'bg-gradient-to-br from-red-500 via-green-500 to-yellow-500',
    backgroundImage: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    text: 'text-white',
    card: 'bg-red-800/80 backdrop-blur-sm border-yellow-400',
    header: 'bg-red-900/90 backdrop-blur-md border-yellow-400',
    accent: 'text-yellow-300 hover:text-yellow-200',
    font: 'font-serif',
    bodyFont: "'Playfair Display', 'Georgia', serif",
    textShadow: 'drop-shadow-lg',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    overlay: 'bg-red-900/50'
  },
  kids: {
    name: 'Kids',
    bg: 'bg-gradient-to-br from-yellow-300 via-pink-400 to-blue-400',
    backgroundImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    text: 'text-gray-800',
    card: 'bg-white/85 backdrop-blur-sm border-pink-300',
    header: 'bg-yellow-200/90 backdrop-blur-md border-pink-300',
    accent: 'text-pink-600 hover:text-pink-800',
    font: 'font-comic',
    bodyFont: '"Comic Sans MS", "Inter", cursive',
    textShadow: 'drop-shadow-sm',
    button: 'bg-pink-500 hover:bg-pink-600 text-white',
    overlay: 'bg-yellow-100/60'
  },
  rainforest: {
    name: 'Rainforest',
    bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-600',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    text: 'text-green-50',
    card: 'bg-green-900/80 backdrop-blur-sm border-emerald-500',
    header: 'bg-green-950/90 backdrop-blur-md border-emerald-600',
    accent: 'text-emerald-300 hover:text-emerald-200',
    font: 'font-serif',
    bodyFont: "'Playfair Display', 'Georgia', serif",
    textShadow: 'drop-shadow-md',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    overlay: 'bg-green-900/70'
  }
}

type ThemeContextType = {
  currentTheme: string
  theme: typeof themes.beach
  setCurrentTheme: (theme: string) => void
  generateThemeFromPrompt: (prompt: string) => Promise<void>
  generateBlogSuggestions: (prompt: string) => Promise<string[]>
  getAllThemes: () => Record<string, any>
  isWebLLMReady: boolean
  webLLMProgress: string
  initializeWebLLM: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState('beach')
  const webLLM = useWebLLM()

  useEffect(() => {
    const saved = localStorage.getItem('blog-theme')
    if (saved && themes[saved as keyof typeof themes]) {
      setCurrentTheme(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('blog-theme', currentTheme)
    // Apply font to body
    const theme = themes[currentTheme as keyof typeof themes] || themes.beach
    document.body.style.fontFamily = theme.bodyFont
  }, [currentTheme])

  const generateThemeFromPrompt = async (prompt: string) => {
    console.log('🎨 Starting theme selection for prompt:', prompt)
    console.log('🧠 WebLLM initialized:', webLLM.isInitialized)
    console.log('📊 WebLLM progress:', webLLM.progress)
    
    try {
      // Only use WebLLM - no fallback
      if (!webLLM.isInitialized) {
        const error = 'AI model not initialized. Please click the input box to load the AI model first.'
        console.error('❌', error)
        throw new Error(error)
      }
      
      console.log('🚀 Calling WebLLM.generateTheme...')
      const response = await webLLM.generateTheme(prompt)
      console.log('✅ AI response:', response)
      
      const selectedThemeName = response.selectedTheme || 'beach'
      console.log('🎯 Selected theme name:', selectedThemeName)
      
      // Verify the theme exists in our predefined themes
      if (themes[selectedThemeName as keyof typeof themes]) {
        setCurrentTheme(selectedThemeName)
        console.log('🎉 Successfully switched to theme:', selectedThemeName)
      } else {
        console.warn('⚠️ Invalid theme name, falling back to beach')
        setCurrentTheme('beach')
      }
    } catch (error) {
      console.error('💥 Theme selection failed:', error)
      throw error
    }
  }

  const getAllThemes = () => {
    return themes
  }

  const generateBlogSuggestions = async (prompt: string): Promise<string[]> => {
    console.log('📝 Generating blog suggestions for prompt:', prompt)
    
    try {
      if (!webLLM.isInitialized) {
        console.log('⚠️ WebLLM not initialized, using fallback suggestions')
        return generateFallbackBlogSuggestions(prompt)
      }
      
      console.log('🤖 Using AI to generate blog suggestions')
      return await webLLM.generateBlogSuggestions(prompt)
    } catch (error) {
      console.error('💥 Failed to generate blog suggestions:', error)
      return generateFallbackBlogSuggestions(prompt)
    }
  }

  const generateFallbackBlogSuggestions = (prompt: string): string[] => {
    const keywords = prompt.toLowerCase()
    
    if (keywords.includes('sad') || keywords.includes('down')) {
      return ['love', 'sports', 'space']
    } else if (keywords.includes('angry') || keywords.includes('frustrated')) {
      return ['faith', 'art', 'compromise']
    } else if (keywords.includes('anxious') || keywords.includes('stress')) {
      return ['space', 'faith', 'everyday']
    } else if (keywords.includes('lonely') || keywords.includes('alone')) {
      return ['love', 'community', 'vulnerability']
    } else if (keywords.includes('excited') || keywords.includes('happy')) {
      return ['future', 'cars', 'mars']
    } else {
      return ['psychology', 'love', 'character']
    }
  }

  const allThemes = getAllThemes()
  const theme = allThemes[currentTheme as keyof typeof allThemes] || themes.beach
  
  // Debug current theme state
  console.log('🎨 ThemeContext state:')
  console.log('  - currentTheme:', currentTheme)
  console.log('  - available themes:', Object.keys(allThemes))
  console.log('  - computed theme:', theme)

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      theme, 
      setCurrentTheme, 
      generateThemeFromPrompt, 
      generateBlogSuggestions,
      getAllThemes,
      isWebLLMReady: webLLM.isInitialized,
      webLLMProgress: webLLM.progress,
      initializeWebLLM: webLLM.initializeEngine
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { themes }
