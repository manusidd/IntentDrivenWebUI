import Head from 'next/head'
import Header from './Header'
import { useTheme } from '../contexts/ThemeContext'
import { useEffect, useRef } from 'react'

interface LayoutProps {
  children: React.ReactNode
  isBlogPost?: boolean
}

export default function Layout({ children, isBlogPost = false }: LayoutProps) {
  const { theme } = useTheme()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Debug theme changes
  console.log('🏠 Layout rendering with theme:', theme)

  useEffect(() => {
    // Create audio context for Christmas chime sound
    const createChristmasChime = () => {
      if (typeof window !== 'undefined') {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          
          const playChristmasChime = () => {
            // Create a sweet Christmas bell chime with harmonics
            const now = audioContext.currentTime
            
            // First bell note (high)
            const osc1 = audioContext.createOscillator()
            const gain1 = audioContext.createGain()
            osc1.connect(gain1)
            gain1.connect(audioContext.destination)
            
            osc1.type = 'sine'
            osc1.frequency.setValueAtTime(1047, now) // C6 - high C
            gain1.gain.setValueAtTime(0.15, now)
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
            
            osc1.start(now)
            osc1.stop(now + 1.2)
            
            // Second bell note (medium) - creates harmony
            const osc2 = audioContext.createOscillator()
            const gain2 = audioContext.createGain()
            osc2.connect(gain2)
            gain2.connect(audioContext.destination)
            
            osc2.type = 'sine'
            osc2.frequency.setValueAtTime(784, now + 0.1) // G5
            gain2.gain.setValueAtTime(0.12, now + 0.1)
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
            
            osc2.start(now + 0.1)
            osc2.stop(now + 1.0)
            
            // Third bell note (lower) - completes the chord
            const osc3 = audioContext.createOscillator()
            const gain3 = audioContext.createGain()
            osc3.connect(gain3)
            gain3.connect(audioContext.destination)
            
            osc3.type = 'sine'
            osc3.frequency.setValueAtTime(523, now + 0.2) // C5 - middle C
            gain3.gain.setValueAtTime(0.1, now + 0.2)
            gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
            
            osc3.start(now + 0.2)
            osc3.stop(now + 0.8)
            
            // Add some sparkle with higher harmonics
            const osc4 = audioContext.createOscillator()
            const gain4 = audioContext.createGain()
            osc4.connect(gain4)
            gain4.connect(audioContext.destination)
            
            osc4.type = 'triangle'
            osc4.frequency.setValueAtTime(2093, now + 0.05) // C7 - very high
            gain4.gain.setValueAtTime(0.05, now + 0.05)
            gain4.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
            
            osc4.start(now + 0.05)
            osc4.stop(now + 0.4)
          }
          
          return playChristmasChime
        } catch (error) {
          console.log('Audio context not available')
          return null
        }
      }
      return null
    }

    const playChristmasChime = createChristmasChime()

    const createRipple = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check if click is on header, blog cards, or interactive elements
      if (
        target.closest('header') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.no-ripple') ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT'
      ) {
        return
      }

      // Play Christmas chime sound
      if (playChristmasChime) {
        playChristmasChime()
      }

      const body = document.body
      const rippleContainer = document.createElement('div')
      const baseSize = 60
      const x = e.clientX - baseSize / 2
      const y = e.clientY - baseSize / 2

      rippleContainer.style.position = 'absolute'
      rippleContainer.style.left = x + 'px'
      rippleContainer.style.top = y + 'px'
      rippleContainer.style.width = baseSize + 'px'
      rippleContainer.style.height = baseSize + 'px'
      rippleContainer.style.pointerEvents = 'none'
      rippleContainer.style.zIndex = '1'
      rippleContainer.classList.add('ripple')

      // Add theme-specific ripple class
      if (theme.bg.includes('gray')) {
        rippleContainer.classList.add('light-ripple')
      } else if (theme.bg.includes('black')) {
        rippleContainer.classList.add('dark-ripple')
      } else {
        rippleContainer.classList.add('colored-ripple')
      }

      // Create 3 concentric circles
      for (let i = 1; i <= 3; i++) {
        const circle = document.createElement('div')
        circle.style.position = 'absolute'
        circle.style.left = '50%'
        circle.style.top = '50%'
        circle.style.width = (baseSize * 0.8) + 'px'
        circle.style.height = (baseSize * 0.8) + 'px'
        circle.style.marginLeft = -(baseSize * 0.4) + 'px'
        circle.style.marginTop = -(baseSize * 0.4) + 'px'
        circle.classList.add('ripple-circle', `ripple-circle-${i}`)
        
        rippleContainer.appendChild(circle)
      }

      body.appendChild(rippleContainer)

      setTimeout(() => {
        if (rippleContainer.parentNode) {
          rippleContainer.parentNode.removeChild(rippleContainer)
        }
      }, 1800) // Increased timeout to match longer animation
    }

    document.addEventListener('click', createRipple)

    return () => {
      document.removeEventListener('click', createRipple)
    }
  }, [theme])

  return (
    <div 
      className={`min-h-screen ${theme.text} ${theme.font} text-sm ripple-container relative`}
      style={{
        backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better text readability */}
      {theme.backgroundImage && (
        <div className={`fixed inset-0 ${theme.overlay || 'bg-black/30'} -z-10`} />
      )}
      
      {/* Fallback gradient background */}
      <div className={`fixed inset-0 ${theme.bg} -z-20`} />
      
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Playfair+Display:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Roboto+Condensed:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: ${theme.bodyFont || "'Inter', sans-serif"} !important;
            }
            .theme-text-shadow {
              filter: ${theme.textShadow || 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))'};
            }
          `
        }} />
      </Head>
      <Header isBlogPost={isBlogPost} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
