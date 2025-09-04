import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'

interface ThemeSwitcherProps {
  placeholder?: string
  onEnterAction?: 'theme' | 'navigate'
}

export default function ThemeSwitcher({ 
  placeholder = "how are you feeling today? (I'll help improve your mood) - Ctrl+Enter to submit",
  onEnterAction = 'theme'
}: ThemeSwitcherProps) {
  const { theme, generateThemeFromPrompt, isWebLLMReady, webLLMProgress, initializeWebLLM } = useTheme()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎯 ThemeSwitcher handleSubmit called with prompt:', prompt)
    
    if (!prompt.trim() || isGenerating) {
      console.log('⏭️ Skipping - empty prompt or already generating')
      return
    }
    
    if (onEnterAction === 'navigate') {
      console.log('🔄 Navigating to home instead of generating theme')
      router.push('/')
      return
    }
    
    setIsGenerating(true)
    console.log('🚀 Starting theme generation...')
    
    try {
      await generateThemeFromPrompt(prompt)
      console.log('✅ Theme generation completed successfully')
      setPrompt('')
    } catch (error) {
      console.error('💥 Failed to generate theme:', error)
      alert('Failed to generate theme. Please try again.')
    } finally {
      setIsGenerating(false)
      console.log('🏁 Theme generation process finished')
    }
  }

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    console.log('🔥 Key pressed:', e.key, 'ctrlKey:', e.ctrlKey, 'shiftKey:', e.shiftKey, 'isGenerating:', isGenerating)
    
    // Allow both Enter and Ctrl+Enter/Shift+Enter
    if (e.key === 'Enter' && !isGenerating) {
      // If it's just Enter, prevent default to avoid new line
      if (!e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
      }
      
      console.log('🎯 Enter key detected, processing...')
      
      // Emit custom event for blog suggestions (always emit, even for empty prompts)
      if (typeof window !== 'undefined') {
        const moodEvent = new CustomEvent('moodInput', { 
          detail: { prompt: prompt.trim() } 
        })
        window.dispatchEvent(moodEvent)
        console.log('📡 Emitted moodInput event with prompt:', prompt.trim())
      }
      
      if (onEnterAction === 'navigate') {
        console.log('🔄 Navigating to home')
        router.push('/')
        return
      }
      
      // For empty prompts, don't change theme - just return
      if (!prompt.trim()) {
        console.log('⏭️ Empty prompt - filters cleared, theme unchanged')
        return
      }
      
      // Check WebLLM readiness for theme generation
      console.log('🧠 WebLLM ready:', isWebLLMReady)
      if (!isWebLLMReady) {
        console.log('⚠️ WebLLM not ready, showing alert')
        alert('Please wait for the AI model to load before generating themes. Click the input box to start loading.')
        return
      }
      
      if (prompt.trim()) {
        console.log('🚀 Starting theme generation with prompt:', prompt)
        setIsGenerating(true)
        
        try {
          await generateThemeFromPrompt(prompt)
          console.log('✅ Theme generation completed successfully')
          setPrompt('')
        } catch (error) {
          console.error('💥 Failed to generate theme:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          alert(`Failed to generate theme: ${errorMessage}`)
        } finally {
          setIsGenerating(false)
          console.log('🏁 Theme generation process finished')
        }
      } else {
        console.log('⚠️ Empty prompt, not generating theme')
      }
    }
  }

  const getPlaceholder = () => {
    if (isGenerating && onEnterAction === 'theme') {
      return isWebLLMReady ? "AI is generating your theme..." : "catching your vibe.. hang in there..."
    }
    if (!isWebLLMReady && onEnterAction === 'theme') {
      if (webLLMProgress.includes('unavailable') || webLLMProgress.includes('Error')) {
        return placeholder // Use the custom placeholder even when AI is unavailable
      }
      if (webLLMProgress.includes('Downloading')) {
        return "catching your vibe.. hang in there..."
      }
      return placeholder // Use the custom placeholder instead of generic AI loading message
    }
    return placeholder
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setPrompt(newValue)
    
    // If input is cleared (empty), emit event to clear filters
    if (newValue.trim() === '' && typeof window !== 'undefined') {
      const moodEvent = new CustomEvent('moodInput', { 
        detail: { prompt: '' } 
      })
      window.dispatchEvent(moodEvent)
      console.log('📡 Input cleared - emitted empty moodInput event')
    }
  }

  const handleInputClick = async () => {
    if (!isWebLLMReady && onEnterAction === 'theme') {
      try {
        await initializeWebLLM()
      } catch (error) {
        console.error('Failed to initialize WebLLM:', error)
      }
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onClick={handleInputClick}
          placeholder={getPlaceholder()}
          rows={3}
          className={`
            px-4 py-3 rounded-xl border-2 text-lg w-96 h-20 resize-none transition-all duration-300 overflow-hidden
            bg-white/90 text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-0
            ${isGenerating ? 'animate-pulse' : ''}
            ${!isWebLLMReady && onEnterAction === 'theme' ? 'cursor-pointer' : ''}
          `}
          style={{
            boxShadow: isGenerating 
              ? '0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(96, 165, 250, 0.4)' 
              : '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(96, 165, 250, 0.3)',
            borderColor: isGenerating ? '#3b82f6' : '#60a5fa',
            animation: isGenerating 
              ? 'breathing-moderate 1.2s ease-in-out infinite, glow-moderate 1.5s ease-in-out infinite' 
              : 'breathing-gentle 2.5s ease-in-out infinite, glow-gentle 3s ease-in-out infinite'
          }}
          disabled={isGenerating}
        />
        {isGenerating && onEnterAction === 'theme' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin text-blue-500">{isWebLLMReady ? '🧠' : '⭐'}</div>
          </div>
        )}
        {!isWebLLMReady && webLLMProgress && onEnterAction === 'theme' && (
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <div className="text-xs text-blue-600">catching your vibe.. hang in there...</div>
          </div>
        )}
        <style jsx>{`
          @keyframes breathing-gentle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
          @keyframes breathing-moderate {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes glow-moderate {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(96, 165, 250, 0.3);
              filter: brightness(1);
            }
            50% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(96, 165, 250, 0.5);
              filter: brightness(1.05);
            }
          }
          @keyframes glow-gentle {
            0%, 100% { 
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(96, 165, 250, 0.2);
              filter: brightness(1);
            }
            50% { 
              box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(96, 165, 250, 0.4);
              filter: brightness(1.02);
            }
          }
        `}</style>
      </div>
    </div>
  )
}