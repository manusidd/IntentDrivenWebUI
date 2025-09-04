import { useState, useCallback, useRef } from 'react'

interface WebLLMHook {
  isLoading: boolean
  isInitialized: boolean
  progress: string
  generateTheme: (prompt: string) => Promise<any>
  generateBlogSuggestions: (prompt: string) => Promise<string[]>
  initializeEngine: () => Promise<void>
}

export function useWebLLM(): WebLLMHook {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [progress, setProgress] = useState('')
  const engineRef = useRef<any>(null)

  const initializeEngine = useCallback(async () => {
    console.log('🔄 WebLLM initializeEngine called')
    console.log('🔍 Current state - engineRef.current:', !!engineRef.current, 'isInitialized:', isInitialized)
    
    if (engineRef.current || isInitialized) {
      console.log('⏭️ WebLLM engine already initialized, skipping')
      return
    }

    try {
      setIsLoading(true)
      setProgress('Checking WebLLM compatibility...')
      console.log('🌐 Checking browser environment...')
      
      // Check if browser supports WebLLM
      if (typeof window === 'undefined') {
        throw new Error('WebLLM requires browser environment')
      }

      // Check for WebGPU support
      console.log('🔍 Checking WebGPU support...')
      if (!(navigator as any).gpu) {
        throw new Error('WebGPU not supported - WebLLM requires Chrome 113+ with WebGPU enabled')
      }
      console.log('✅ WebGPU available')

      setProgress('Loading WebLLM library...')
      console.log('📚 Loading WebLLM library...')
      
      // Dynamic import for client-side only
      const { CreateMLCEngine, prebuiltAppConfig } = await import('@mlc-ai/web-llm')
      console.log('✅ WebLLM library loaded')
      
      setProgress('Checking available models...')
      console.log('📋 Checking available models...')
      
      // Try to find a smaller model from available ones
      const availableModels = prebuiltAppConfig.model_list.map((model: any) => model.model_id)
      console.log('📝 Available WebLLM models:', availableModels)
      
      // Try different model options in order of preference (smallest first)
      const modelOptions = [
        "TinyLlama-1.1B-Chat-v0.4-q4f16_1-1k", // ~700MB
        "Qwen2-0.5B-Instruct-q4f16_1",          // ~400MB  
        "SmolLM-135M-Instruct-q4f16_1",         // ~100MB
        "RedPajama-INCITE-Chat-3B-v1-q4f16_1",  // ~2GB
      ]
      
      let selectedModel = null
      for (const model of modelOptions) {
        if (availableModels.includes(model)) {
          selectedModel = model
          console.log('🎯 Selected model:', selectedModel)
          break
        }
      }
      
      if (!selectedModel) {
        // Fallback to first available model
        selectedModel = availableModels[0]
        console.log('🔄 Using fallback model:', selectedModel)
      }
      
      setProgress(`Initializing ${selectedModel} (this may take a few minutes)...`)
      console.log('🚀 Creating MLC Engine with model:', selectedModel)
      
      const engine = await CreateMLCEngine(
        selectedModel,
        {
          initProgressCallback: (progress: any) => {
            const progressText = `Downloading model: ${(progress.progress * 100).toFixed(1)}%`
            setProgress(progressText)
            console.log('📥', progressText)
          }
        }
      )
      
      console.log('✅ WebLLM Engine created successfully')
      engineRef.current = engine
      setIsInitialized(true)
      setProgress('AI model ready!')
      console.log('🎉 WebLLM initialization complete!')
    } catch (error) {
      console.error('💥 Failed to initialize WebLLM:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setProgress(`WebLLM unavailable: ${errorMessage}`)
      console.error('🔍 WebLLM Error details:', errorMessage)
      // Don't set initialized to true, keep using fallback
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized])

  const generateTheme = useCallback(async (prompt: string) => {
    console.log('🎨 WebLLM generateTheme called with prompt:', prompt)
    console.log('🔍 Engine state - engineRef.current:', !!engineRef.current, 'isInitialized:', isInitialized)
    
    if (!engineRef.current) {
      console.error('❌ WebLLM not initialized - engine is null')
      throw new Error('WebLLM not initialized')
    }

    setIsLoading(true)
    setProgress('AI is thinking...')
    console.log('🤖 Starting AI theme generation...')

    try {
      const themePrompt = `You are a therapeutic web design expert. Based on the user's mood/prompt, select a theme that will COMPENSATE and IMPROVE their emotional state, not match it.

Available themes:
- beach (uplifting, calming, positive energy - use for sad, stressed, anxious moods)
- autumn (cozy, warm, comforting - use for lonely, cold, disconnected feelings)
- space (inspiring, vast, perspective - use for feeling stuck, small, limited)
- dark (professional, focused, serious - use for playful moods that need focus, or when they want to be productive)
- desert (minimalist, peaceful, zen - use for chaotic, overwhelmed, cluttered mental states)
- pastel (gentle, soothing, soft - use for angry, harsh, aggressive feelings)
- corporate (professional, business-like, clean - use for casual moods that need structure)
- festive (celebration, joy, holiday spirit - use for boring, mundane, routine feelings)
- kids (playful, colorful, fun - use for serious, adult, rigid moods that need lightening)
- rainforest (natural, lush, alive - use for urban fatigue, tech overwhelm, disconnection from nature)

COMPENSATORY LOGIC:
- If they're SAD/DEPRESSED → beach (bright, uplifting)
- If they're ANGRY/FRUSTRATED → pastel (calming, gentle)
- If they're ANXIOUS/STRESSED → beach or desert (peaceful)
- If they're LONELY/ISOLATED → autumn (cozy, warm)
- If they're OVERWHELMED/CHAOTIC → desert (minimal, zen)
- If they're FEELING SMALL/INSIGNIFICANT → space (vast, inspiring)
- If they're UNFOCUSED/PLAYFUL but need to work → dark or corporate (serious, productive)
- If they're HARSH/CRITICAL → pastel (gentle, soft)
- If they're BORED/ROUTINE → festive (exciting, celebratory)
- If they're TOO SERIOUS/RIGID → kids (playful, fun)
- If they're TECH OVERWHELMED/URBAN FATIGUE → rainforest (natural, grounding)
- If they're UNSTRUCTURED/CASUAL but need discipline → corporate (structured)

User prompt: "${prompt}"

Analyze their emotional state and select the theme that will HELP and UPLIFT them, not mirror their current mood.

Return ONLY the theme name (one word):`

      console.log('📤 Sending prompt to WebLLM:', themePrompt.substring(0, 100) + '...')
      
      const response = await engineRef.current.chat.completions.create({
        messages: [{ role: "user", content: themePrompt }],
        temperature: 0.7,
        max_tokens: 200
      })

      console.log('📥 Raw WebLLM response:', response)
      const content = response.choices[0]?.message?.content || ''
      console.log('📋 Response content:', content)
      
      // Extract theme name from response (much simpler now)
      const themeName = content.trim().toLowerCase().replace(/[^a-z]/g, '')
      console.log('🎯 Extracted theme name:', themeName)
      
      // Validate theme name against available themes
      const validThemes = ['beach', 'autumn', 'space', 'dark', 'desert', 'pastel', 'corporate', 'festive', 'kids', 'rainforest']
      
      if (validThemes.includes(themeName)) {
        console.log('✅ Valid theme selected:', themeName)
        setProgress(`Switched to ${themeName} theme!`)
        return { selectedTheme: themeName }
      } else {
        console.warn('⚠️ Invalid theme name, using fallback logic')
        
        // Fallback: match keywords in original content
        const fallbackTheme = selectThemeByKeywords(prompt.toLowerCase())
        console.log('🔄 Fallback theme selected:', fallbackTheme)
        setProgress(`Switched to ${fallbackTheme} theme!`)
        return { selectedTheme: fallbackTheme }
      }
    } catch (error) {
      console.error('💥 AI theme generation failed:', error)
      setProgress('AI generation failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateBlogSuggestions = useCallback(async (prompt: string): Promise<string[]> => {
    console.log('📝 WebLLM generateBlogSuggestions called with prompt:', prompt)
    
    if (!engineRef.current) {
      console.log('⚠️ WebLLM not initialized, using fallback suggestions')
      // Fallback suggestions based on keywords
      const fallbackSuggestions = generateFallbackSuggestions(prompt)
      return fallbackSuggestions
    }

    setIsLoading(true)
    setProgress('Finding relevant blog topics...')
    console.log('🔍 Generating blog suggestions with AI...')

    try {
      const suggestionPrompt = `Based on the user's mood/prompt: "${prompt}"

Suggest exactly 3 blog topic keywords that would be most relevant and helpful for someone in this emotional state. Focus on topics that could:
- Provide comfort, insight, or perspective
- Help them process their feelings
- Offer practical advice or inspiration
- Connect to their current mental/emotional state

Available blog topics/themes:
- politics, democracy, government
- cars, mobility, transportation, electric vehicles
- love, relationships, vulnerability, digital age
- faith, spirituality, divine, paradox
- mars, space, psychology, exploration
- sports, character, community, psychology
- art, compromise, everyday moments
- future, technology, dreams

Respond with ONLY 3 topic keywords, separated by commas, no explanations.
Example: "love, space, sports"`

      const response = await engineRef.current.chat.completions.create({
        messages: [{ role: 'user', content: suggestionPrompt }],
        temperature: 0.7,
        max_tokens: 50
      })

      const suggestions = response.choices[0]?.message?.content?.trim() || ''
      console.log('🤖 AI blog suggestions response:', suggestions)
      
      // Parse the comma-separated suggestions
      const topicList = suggestions
        .split(',')
        .map((topic: string) => topic.trim().toLowerCase())
        .filter((topic: string) => topic.length > 0)
        .slice(0, 3) // Ensure max 3 suggestions
      
      console.log('📋 Parsed topic suggestions:', topicList)
      
      if (topicList.length === 0) {
        console.warn('⚠️ No valid suggestions from AI, using fallback')
        return generateFallbackSuggestions(prompt)
      }
      
      setProgress('Found relevant topics!')
      return topicList
      
    } catch (error) {
      console.error('💥 AI suggestion generation failed:', error)
      console.log('🔄 Using fallback suggestions')
      return generateFallbackSuggestions(prompt)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateFallbackSuggestions = (prompt: string): string[] => {
    const keywords = prompt.toLowerCase()
    const suggestions: string[] = []
    
    // Emotional state based suggestions
    if (keywords.includes('sad') || keywords.includes('down') || keywords.includes('depressed')) {
      suggestions.push('love', 'sports', 'space')
    } else if (keywords.includes('angry') || keywords.includes('frustrated') || keywords.includes('mad')) {
      suggestions.push('faith', 'art', 'everyday')
    } else if (keywords.includes('anxious') || keywords.includes('worried') || keywords.includes('stress')) {
      suggestions.push('space', 'faith', 'love')
    } else if (keywords.includes('lonely') || keywords.includes('isolated') || keywords.includes('alone')) {
      suggestions.push('love', 'community', 'sports')
    } else if (keywords.includes('excited') || keywords.includes('happy') || keywords.includes('great')) {
      suggestions.push('future', 'space', 'cars')
    } else if (keywords.includes('confused') || keywords.includes('lost') || keywords.includes('uncertain')) {
      suggestions.push('politics', 'faith', 'psychology')
    } else {
      // Default suggestions
      suggestions.push('love', 'space', 'psychology')
    }
    
    return suggestions.slice(0, 3)
  }

  return {
    isLoading,
    isInitialized,
    progress,
    generateTheme,
    generateBlogSuggestions,
    initializeEngine
  }
}

// Helper function to select theme based on keywords when AI fails
function selectThemeByKeywords(prompt: string): string {
  console.log('� Selecting theme by keywords for:', prompt)
  
  const keywordMap = {
    // Compensatory mood mapping - themes that help balance emotions
    beach: ['sad', 'depressed', 'down', 'anxious', 'worried'], // uplifting for negative moods
    pastel: ['angry', 'mad', 'frustrated', 'harsh', 'critical'], // calming for aggressive moods
    desert: ['overwhelmed', 'chaotic', 'stressed', 'cluttered', 'panic'], // zen for chaos
    autumn: ['lonely', 'isolated', 'cold'], // cozy for isolation
    space: ['small', 'insignificant', 'stuck', 'limited'], // expansive for feeling trapped
    dark: ['unfocused', 'distracted', 'playful', 'work', 'serious', 'professional'], // focused for productivity
    corporate: ['casual', 'unstructured', 'messy', 'disorganized'], // structure for chaos
    festive: ['bored', 'routine', 'mundane', 'dull', 'monotonous'], // excitement for boredom
    kids: ['rigid', 'uptight', 'formal', 'stiff', 'adult'], // playful for rigidity
    rainforest: ['urban', 'tech', 'digital', 'artificial', 'disconnected'] // natural for tech fatigue
  }
  
  let bestMatch = 'beach' // default
  let maxScore = 0
  
  for (const [theme, keywords] of Object.entries(keywordMap)) {
    let score = 0
    keywords.forEach(keyword => {
      if (prompt.includes(keyword)) {
        score += 1
      }
    })
    
    if (score > maxScore) {
      maxScore = score
      bestMatch = theme
    }
  }
  
  console.log(`� Best keyword match: ${bestMatch} (score: ${maxScore})`)
  return bestMatch
}
