import Head from 'next/head'
import Layout from '../components/Layout'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

export default function Express() {
  const { theme, generateBlogSuggestions } = useTheme()
  const [userPrompt, setUserPrompt] = useState('')
  const [generatedComponents, setGeneratedComponents] = useState<any[]>([])
  const [posterData, setPosterData] = useState<{ [key: string]: any }>({})
  const [detectedStyle, setDetectedStyle] = useState('minimal')
  const [isGenerating, setIsGenerating] = useState(false)

  const analyzePromptAndGenerateForm = async (prompt: string) => {
    if (!prompt.trim()) {
      setGeneratedComponents([])
      setPosterData({})
      setDetectedStyle('minimal')
      setCurrentStyleVariation({ bg: 'bg-white border border-gray-200', text: 'text-gray-800', accent: 'text-gray-600' })
      return
    }

    console.log('🔍 Starting analysis for prompt:', prompt)
    setIsGenerating(true)
    
    try {
      // Clear previous state first to ensure clean slate
      setGeneratedComponents([])
      setPosterData({})
      
      // Add small delay to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // For now, we'll use a rule-based approach that mimics LLM behavior
      // In the future, this could be replaced with actual LLM calls
      const components = generateFormComponents(prompt)
      const style = detectMoodStyle(prompt)
      
      console.log('📝 Generated', components.length, 'components')
      console.log('🎨 Detected style:', style)
      
      // Generate new style variation only when form is generated
      const newStyleVariation = getPosterStyle(style)
      console.log('🎨 Applied style variation:', newStyleVariation)
      
      // Update all state together
      setGeneratedComponents(components)
      setDetectedStyle(style)
      setCurrentStyleVariation(newStyleVariation)
      
      // Initialize poster data with default values
      const initialData: { [key: string]: any } = {}
      components.forEach(comp => {
        if (comp.key) {
          initialData[comp.key] = comp.defaultValue || ''
        }
      })
      setPosterData(initialData)
      
      console.log('✅ Form generation completed successfully')
      
    } catch (error) {
      console.error('❌ Failed to analyze prompt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFormComponents = (prompt: string): any[] => {
    const lowercasePrompt = prompt.toLowerCase()
    const components: any[] = []

    // Always include recipient
    components.push({
      type: 'text',
      key: 'recipient',
      label: 'Who is this for?',
      placeholder: 'e.g., my best friend, mom, partner...',
      required: true
    })

    // Detect if they want date/birthday functionality
    if (lowercasePrompt.includes('birthday') || lowercasePrompt.includes('date') || 
        lowercasePrompt.includes('anniversary') || lowercasePrompt.includes('celebration')) {
      components.push({
        type: 'date',
        key: 'specialDate',
        label: 'Special Date',
        placeholder: 'Select the important date',
        required: false
      })
    }

    // Detect if they want name input
    if (lowercasePrompt.includes('name') || lowercasePrompt.includes('called') || 
        lowercasePrompt.includes('named')) {
      components.push({
        type: 'text',
        key: 'personName',
        label: 'Their Name',
        placeholder: 'Enter their name',
        required: false
      })
    }

    // Detect if they want feelings/emotions input
    if (lowercasePrompt.includes('feeling') || lowercasePrompt.includes('emotion') || 
        lowercasePrompt.includes('mood') || lowercasePrompt.includes('sad') || 
        lowercasePrompt.includes('happy') || lowercasePrompt.includes('love') ||
        lowercasePrompt.includes('grateful') || lowercasePrompt.includes('sorry')) {
      components.push({
        type: 'textarea',
        key: 'feelings',
        label: 'Describe Your Feelings',
        placeholder: 'How are you feeling about them or this situation?',
        rows: 3,
        required: false
      })
      
      // Add auto-generated description
      components.push({
        type: 'generated-text',
        key: 'description',
        label: 'Generated Message',
        placeholder: 'A thoughtful message will be generated based on your feelings...',
        dependsOn: 'feelings'
      })
    }

    // Detect if they want a personal message
    if (lowercasePrompt.includes('message') || lowercasePrompt.includes('tell') || 
        lowercasePrompt.includes('say') || lowercasePrompt.includes('express')) {
      components.push({
        type: 'textarea',
        key: 'personalMessage',
        label: 'Your Personal Message',
        placeholder: 'What do you want to tell them?',
        rows: 4,
        required: true
      })
    }

    // Detect if they want memory/occasion input
    if (lowercasePrompt.includes('memory') || lowercasePrompt.includes('remember') || 
        lowercasePrompt.includes('occasion') || lowercasePrompt.includes('moment')) {
      components.push({
        type: 'textarea',
        key: 'memory',
        label: 'Special Memory or Occasion',
        placeholder: 'Describe the memory or occasion...',
        rows: 3,
        required: false
      })
    }

    // If no specific components detected, add a general message field
    if (components.length === 1) { // Only recipient
      components.push({
        type: 'textarea',
        key: 'message',
        label: 'Your Message',
        placeholder: 'What would you like to express?',
        rows: 4,
        required: true
      })
    }

    return components
  }

  const detectMoodStyle = (prompt: string): string => {
    const lowercasePrompt = prompt.toLowerCase()
    
    console.log('🎨 Analyzing prompt for style:', lowercasePrompt)
    
    // Bold style - for strong emotions, celebrations, excitement, achievements
    const boldKeywords = ['love', 'celebrate', 'excited', 'proud', 'amazing', 'birthday', 
                         'congratulat', 'awesome', 'fantastic', 'wonderful', 'achievement', 
                         'success', 'victory', 'win', 'champion', 'best', 'incredible',
                         'party', 'graduation', 'wedding', 'anniversary', 'milestone',
                         'joy', 'happy', 'thrilled', 'elated', 'fantastic', 'brilliant']
    
    // Warm style - for comfort, support, family, friendship, gratitude
    const warmKeywords = ['comfort', 'support', 'family', 'friend', 'cozy', 'warm', 
                         'home', 'grateful', 'thank', 'appreciate', 'welcome', 'caring',
                         'kind', 'sweet', 'mother', 'father', 'sister', 'brother', 'togetherness',
                         'friendship', 'community', 'belonging', 'embrace', 'hug', 'love you']
    
    // Soft style - for gentle emotions, apologies, sympathy, care, missing someone
    const softKeywords = ['sorry', 'gentle', 'soft', 'care', 'sympathy', 'peaceful', 
                         'calm', 'miss', 'apologize', 'forgive', 'understand', 'tender',
                         'delicate', 'quiet', 'serene', 'soothe', 'comfort', 'heal',
                         'think of you', 'remember', 'farewell', 'goodbye', 'condolence']
    
    // Count matches for each style to determine the strongest theme
    const boldMatches = boldKeywords.filter(keyword => lowercasePrompt.includes(keyword))
    const warmMatches = warmKeywords.filter(keyword => lowercasePrompt.includes(keyword))
    const softMatches = softKeywords.filter(keyword => lowercasePrompt.includes(keyword))
    
    console.log('🔥 Bold matches:', boldMatches)
    console.log('🔥 Warm matches:', warmMatches)
    console.log('🌸 Soft matches:', softMatches)
    
    // Determine style based on highest match count
    const scores = {
      bold: boldMatches.length,
      warm: warmMatches.length,
      soft: softMatches.length
    }
    
    // Find the style with the highest score
    const maxScore = Math.max(scores.bold, scores.warm, scores.soft)
    
    if (maxScore > 0) {
      if (scores.bold === maxScore) {
        console.log('🔥 Bold style selected with', boldMatches.length, 'matches:', boldMatches)
        return 'bold'
      } else if (scores.warm === maxScore) {
        console.log('🧡 Warm style selected with', warmMatches.length, 'matches:', warmMatches)
        return 'warm'
      } else {
        console.log('🌸 Soft style selected with', softMatches.length, 'matches:', softMatches)
        return 'soft'
      }
    }
    
    // Additional context-based detection for edge cases
    if (lowercasePrompt.includes('get well') || lowercasePrompt.includes('feel better')) {
      console.log('🌿 Get well detected - using soft style')
      return 'soft'
    }
    
    if (lowercasePrompt.includes('thanksgiving') || lowercasePrompt.includes('christmas') || 
        lowercasePrompt.includes('holiday')) {
      console.log('🦃 Holiday detected - using warm style')
      return 'warm'
    }
    
    // Check for exclamation marks or emotional intensity
    if (lowercasePrompt.includes('!') || lowercasePrompt.includes('wow') || 
        lowercasePrompt.includes('yay')) {
      console.log('❗ Excitement detected - using bold style')
      return 'bold'
    }
    
    console.log('📝 No specific style detected - using minimal')
    return 'minimal'
  }

  const generateDescription = (feelings: string): string => {
    if (!feelings) return ''
    
    const feelingsLower = feelings.toLowerCase()
    
    if (feelingsLower.includes('grateful') || feelingsLower.includes('thankful')) {
      return `I am deeply grateful for your presence in my life. Your kindness and support mean the world to me.`
    }
    if (feelingsLower.includes('miss') || feelingsLower.includes('far')) {
      return `Even though we're apart, you're always in my thoughts. Distance can't diminish how much you mean to me.`
    }
    if (feelingsLower.includes('proud')) {
      return `I am so incredibly proud of you and all that you've accomplished. You inspire me every day.`
    }
    if (feelingsLower.includes('love')) {
      return `My love for you grows stronger each day. You bring so much joy and meaning to my life.`
    }
    if (feelingsLower.includes('sorry') || feelingsLower.includes('apologize')) {
      return `I want you to know how truly sorry I am. Your forgiveness would mean everything to me.`
    }
    if (feelingsLower.includes('happy') || feelingsLower.includes('joy')) {
      return `You bring such happiness and light into my life. Thank you for being exactly who you are.`
    }
    
    return `Your impact on my life is immeasurable. I wanted you to know how much you mean to me.`
  }

  const handleInputChange = (key: string, value: any) => {
    setPosterData(prev => {
      const updated = { ...prev, [key]: value }
      
      // Auto-generate description if feelings change
      if (key === 'feelings' && value) {
        updated.description = generateDescription(value)
      }
      
      return updated
    })
  }

  const renderFormComponent = (component: any) => {
    const baseInputClass = `w-full px-4 py-3 rounded-xl border-2 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-300`
    const baseStyle = {
      borderColor: '#60a5fa',
      boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
    }

    switch (component.type) {
      case 'text':
        return (
          <input
            key={component.key}
            type="text"
            value={posterData[component.key] || ''}
            onChange={(e) => handleInputChange(component.key, e.target.value)}
            placeholder={component.placeholder}
            className={baseInputClass}
            style={baseStyle}
            required={component.required}
          />
        )
      
      case 'date':
        return (
          <input
            key={component.key}
            type="date"
            value={posterData[component.key] || ''}
            onChange={(e) => handleInputChange(component.key, e.target.value)}
            className={baseInputClass}
            style={baseStyle}
            required={component.required}
          />
        )
      
      case 'textarea':
        return (
          <textarea
            key={component.key}
            value={posterData[component.key] || ''}
            onChange={(e) => handleInputChange(component.key, e.target.value)}
            placeholder={component.placeholder}
            rows={component.rows || 3}
            className={`${baseInputClass} resize-none`}
            style={baseStyle}
            required={component.required}
          />
        )
      
      case 'generated-text':
        return (
          <div
            key={component.key}
            className={`${baseInputClass} min-h-[80px] bg-blue-50 border-blue-200 italic text-blue-800`}
          >
            {posterData[component.key] || component.placeholder}
          </div>
        )
      
      default:
        return null
    }
  }

  const [currentStyleVariation, setCurrentStyleVariation] = useState({ bg: 'bg-white border border-gray-200', text: 'text-gray-800', accent: 'text-gray-600' })

  const getPosterStyle = (styleType: string) => {
    // Add randomization to prevent always getting the same style
    const getRandomVariation = (variations: any[]) => {
      const randomIndex = Math.floor(Math.random() * variations.length)
      console.log(`🎨 Selected variation ${randomIndex + 1} of ${variations.length} for ${styleType}`)
      return variations[randomIndex]
    }

    const styleVariations = {
      minimal: [
        { bg: 'bg-white border border-gray-200', text: 'text-gray-800', accent: 'text-gray-600' },
        { bg: 'bg-gray-50 border border-gray-300', text: 'text-gray-900', accent: 'text-gray-700' },
        { bg: 'bg-slate-100 border border-slate-300', text: 'text-slate-800', accent: 'text-slate-600' },
        { bg: 'bg-stone-50 border border-stone-200', text: 'text-stone-800', accent: 'text-stone-600' }
      ],
      warm: [
        { bg: 'bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200', text: 'text-orange-900', accent: 'text-orange-700' },
        { bg: 'bg-gradient-to-br from-amber-100 to-orange-200 border border-amber-300', text: 'text-amber-900', accent: 'text-amber-700' },
        { bg: 'bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-300', text: 'text-yellow-900', accent: 'text-yellow-700' },
        { bg: 'bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200', text: 'text-rose-900', accent: 'text-rose-700' },
        { bg: 'bg-gradient-to-br from-peach-100 to-coral-100 border border-orange-200', text: 'text-orange-800', accent: 'text-orange-600' }
      ],
      bold: [
        { bg: 'bg-gradient-to-br from-purple-400 to-pink-400 text-white border border-purple-300', text: 'text-white', accent: 'text-purple-100' },
        { bg: 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border border-blue-300', text: 'text-white', accent: 'text-blue-100' },
        { bg: 'bg-gradient-to-br from-red-400 to-pink-500 text-white border border-red-300', text: 'text-white', accent: 'text-red-100' },
        { bg: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-300', text: 'text-white', accent: 'text-indigo-100' },
        { bg: 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-white border border-emerald-300', text: 'text-white', accent: 'text-emerald-100' }
      ],
      soft: [
        { bg: 'bg-gradient-to-br from-blue-100 to-green-100 border border-blue-200', text: 'text-blue-900', accent: 'text-blue-700' },
        { bg: 'bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200', text: 'text-purple-900', accent: 'text-purple-700' },
        { bg: 'bg-gradient-to-br from-teal-100 to-cyan-100 border border-teal-200', text: 'text-teal-900', accent: 'text-teal-700' },
        { bg: 'bg-gradient-to-br from-lavender-100 to-sky-100 border border-purple-200', text: 'text-purple-800', accent: 'text-purple-600' },
        { bg: 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200', text: 'text-green-900', accent: 'text-green-700' }
      ]
    }

    const variations = styleVariations[styleType as keyof typeof styleVariations] || styleVariations.minimal
    return getRandomVariation(variations)
  }

  return (
    <Layout>
      <Head>
        <title>Express Yourself - Create a Poster</title>
      </Head>
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className={`${theme.card} border rounded-2xl p-8 shadow-2xl backdrop-blur-md ${theme.font}`}>
          <h1 className={`text-3xl font-bold mb-2 ${theme.accent || theme.text} text-center`}>
            Express Yourself
          </h1>
          <p className={`text-lg ${theme.text} opacity-80 text-center mb-8`}>
            Describe what you want to create, and I'll build the perfect form for you
          </p>

          {/* Prompt Input */}
          <div className="mb-8">
            <label className={`block text-lg font-medium ${theme.text} mb-3 text-center`}>
              What kind of message do you want to create?
            </label>
            <div className="max-w-2xl mx-auto">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                    e.preventDefault()
                    const currentPrompt = e.currentTarget.value.trim()
                    if (currentPrompt) {
                      console.log('🔍 Enter pressed, analyzing prompt:', currentPrompt)
                      analyzePromptAndGenerateForm(currentPrompt)
                    }
                  }
                }}
                placeholder="e.g., 'I want to wish someone happy birthday', 'I want to tell my friend how grateful I am', 'I miss someone and want to express my feelings'... (Press Enter to generate)"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-300 resize-none text-center ${isGenerating ? 'animate-pulse' : ''}`}
                style={{
                  borderColor: isGenerating ? '#3b82f6' : '#60a5fa',
                  boxShadow: isGenerating 
                    ? '0 0 25px rgba(59, 130, 246, 0.6)' 
                    : '0 0 20px rgba(59, 130, 246, 0.4)'
                }}
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="text-center mt-2">
                  <span className="text-blue-600 text-sm">Analyzing your request...</span>
                </div>
              )}
            </div>
          </div>

          {generatedComponents.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dynamic Form Section */}
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>
                  Your Custom Form
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${theme.button}`}>
                    {detectedStyle} style detected
                  </span>
                </h3>
                
                {generatedComponents.map((component) => (
                  <div key={component.key}>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      {component.label}
                      {component.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFormComponent(component)}
                  </div>
                ))}
              </div>

              {/* Preview Section */}
              <div className="flex flex-col">
                <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>Live Preview</h3>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`w-64 h-80 rounded-2xl shadow-xl flex flex-col justify-center items-center p-6 text-center transition-all duration-300 ${currentStyleVariation.bg}`}>
                    {posterData.recipient && (
                      <div className={`text-sm opacity-70 mb-2 ${currentStyleVariation.accent}`}>
                        To {posterData.recipient}
                      </div>
                    )}
                    
                    {posterData.personName && (
                      <div className={`text-lg font-semibold mb-2 ${currentStyleVariation.text}`}>
                        {posterData.personName}
                      </div>
                    )}
                    
                    {posterData.specialDate && (
                      <div className={`text-sm mb-2 ${currentStyleVariation.accent}`}>
                        {new Date(posterData.specialDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                    
                    <div className={`text-base font-medium leading-relaxed mb-2 ${currentStyleVariation.text}`}>
                      {posterData.description || posterData.personalMessage || posterData.message || 'Your message will appear here...'}
                    </div>
                    
                    {posterData.memory && (
                      <div className={`text-sm mb-2 italic ${currentStyleVariation.accent}`}>
                        "{posterData.memory}"
                      </div>
                    )}
                    
                    {posterData.feelings && (
                      <div className={`text-xs mt-auto opacity-60 italic ${currentStyleVariation.accent}`}>
                        Sent with love and {posterData.feelings.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className={`mt-6 px-6 py-3 rounded-xl ${theme.button} font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={!posterData.recipient?.trim() || (!posterData.message?.trim() && !posterData.personalMessage?.trim() && !posterData.description?.trim())}
                >
                  Create Poster
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}
