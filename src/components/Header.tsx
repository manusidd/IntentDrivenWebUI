import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'
import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

interface HeaderProps {
  isBlogPost?: boolean
}

export default function Header({ isBlogPost = false }: HeaderProps) {
  const { theme, currentTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className={`${theme.header} border-b backdrop-blur-md`}>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className={`text-lg font-semibold ${theme.accent || theme.text} ${theme.font} ${theme.textShadow || ''} whitespace-nowrap`}>
            Hey,
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 ${theme.text}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 flex justify-center max-w-lg">
            <ThemeSwitcher 
              placeholder={isBlogPost ? "feeling different.. want get more cerebral..?" : "how lovely to meet you, what's on your mind?"}
              onEnterAction={isBlogPost ? 'navigate' : 'theme'}
            />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link 
              href="/express" 
              className={`px-3 py-2 rounded-lg ${theme.button} text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap ${theme.font}`}
            >
              express yourself to someone...
            </Link>
            <div className="flex gap-3">
              <a href="/mock-govt-portal1.html" className={`text-xs ${theme.text} hover:${theme.accent || theme.text} transition-colors ${theme.font} underline`}>
                Mock Govt Portal1
              </a>
              <a href="/mock-govt-portal2.html" className={`text-xs ${theme.text} hover:${theme.accent || theme.text} transition-colors ${theme.font} underline`}>
                Mock Govt Portal 2
              </a>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 py-4 border-t border-gray-200`}>
            <div className="flex flex-col items-center gap-3">
              <Link 
                href="/express" 
                className={`px-4 py-2 rounded-lg ${theme.button} text-sm font-medium transition-all duration-200 ${theme.font}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                express yourself to someone...
              </Link>
              <div className="flex flex-col gap-2">
                <a href="/mock-govt-portal1.html" className={`text-sm ${theme.text} hover:${theme.accent || theme.text} transition-colors ${theme.font} text-center underline`}>
                  Mock Govt Portal1
                </a>
                <a href="/mock-govt-portal2.html" className={`text-sm ${theme.text} hover:${theme.accent || theme.text} transition-colors ${theme.font} text-center underline`}>
                  Mock Govt Portal 2
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
