// Enhanced rule-based theme generator with more intelligence
export interface SmartThemeOptions {
  colors: string[]
  mood: 'light' | 'dark' | 'vibrant' | 'muted'
  style: 'modern' | 'classic' | 'minimal' | 'bold'
  font: 'sans' | 'serif' | 'mono'
}

export function generateSmartTheme(prompt: string): any {
  const lowerPrompt = prompt.toLowerCase()
  
  // Advanced color analysis
  const colorMap = {
    // Nature
    'forest|green|nature|plants|leaf': ['green', 'emerald', 'teal'],
    'ocean|sea|water|blue|waves': ['blue', 'cyan', 'teal'],
    'sunset|orange|fire|warm': ['orange', 'red', 'yellow'],
    'sky|light blue|air': ['sky', 'blue', 'cyan'],
    'earth|brown|soil|wood': ['amber', 'orange', 'yellow'],
    
    // Emotions
    'love|romance|pink|heart': ['pink', 'rose', 'red'],
    'energy|electric|neon|bright': ['lime', 'green', 'yellow'],
    'calm|peace|serene|zen': ['blue', 'gray', 'slate'],
    'mysterious|magic|purple': ['purple', 'violet', 'indigo'],
    'luxury|gold|elegant|rich': ['yellow', 'amber', 'orange'],
    
    // Themes
    'space|cosmic|galaxy|stars': ['purple', 'blue', 'indigo'],
    'cyberpunk|tech|digital|code': ['cyan', 'purple', 'pink'],
    'vintage|retro|old|classic': ['amber', 'orange', 'red'],
    'minimalist|clean|simple': ['gray', 'slate', 'stone'],
    'tropical|summer|beach': ['cyan', 'yellow', 'green'],
    
    // Seasons
    'winter|cold|ice|snow': ['blue', 'cyan', 'slate'],
    'spring|fresh|new|growth': ['green', 'lime', 'emerald'],
    'summer|hot|bright|sun': ['yellow', 'orange', 'red'],
    'autumn|fall|cozy|warm': ['orange', 'red', 'amber'],
  }
  
  // Mood analysis
  let mood: SmartThemeOptions['mood'] = 'light'
  if (lowerPrompt.match(/dark|night|black|shadow|deep/)) mood = 'dark'
  else if (lowerPrompt.match(/bright|vibrant|electric|neon|bold/)) mood = 'vibrant'
  else if (lowerPrompt.match(/soft|gentle|muted|subtle|calm/)) mood = 'muted'
  
  // Style analysis
  let style: SmartThemeOptions['style'] = 'modern'
  if (lowerPrompt.match(/classic|traditional|vintage|retro/)) style = 'classic'
  else if (lowerPrompt.match(/minimal|clean|simple|zen/)) style = 'minimal'
  else if (lowerPrompt.match(/bold|strong|dramatic|intense/)) style = 'bold'
  
  // Font analysis
  let font: SmartThemeOptions['font'] = 'sans'
  if (lowerPrompt.match(/code|tech|digital|cyber|mono/)) font = 'mono'
  else if (lowerPrompt.match(/book|classic|elegant|traditional/)) font = 'serif'
  
  // Find matching colors
  let colors = ['blue', 'gray', 'slate'] // default
  for (const [pattern, colorSet] of Object.entries(colorMap)) {
    if (lowerPrompt.match(new RegExp(pattern))) {
      colors = colorSet
      break
    }
  }
  
  // Generate theme based on analysis
  return buildTheme({ colors, mood, style, font }, prompt)
}

function buildTheme(options: SmartThemeOptions, prompt: string) {
  const [primary, secondary, accent] = options.colors
  const isDark = options.mood === 'dark'
  const isVibrant = options.mood === 'vibrant'
  
  // Intensity based on mood
  const bgIntensity = isDark ? '900' : isVibrant ? '500' : '100'
  const textIntensity = isDark ? '100' : '900'
  const cardOpacity = isDark ? '80' : isVibrant ? '85' : '90'
  
  // Background complexity based on style
  const bgStyle = options.style === 'minimal' 
    ? `bg-${primary}-${bgIntensity}`
    : `bg-gradient-to-br from-${primary}-${bgIntensity} via-${secondary}-${isDark ? '800' : '200'} to-${accent}-${isDark ? '700' : '300'}`
  
  return {
    name: prompt.charAt(0).toUpperCase() + prompt.slice(1),
    bg: bgStyle,
    text: `text-${primary}-${textIntensity}`,
    card: `bg-${isDark ? 'gray-800' : 'white'}/${cardOpacity} backdrop-blur-sm border-${primary}-${isDark ? '400' : '300'}`,
    header: `bg-${isDark ? 'gray-900' : 'white'}/${isDark ? '90' : '95'} backdrop-blur-sm border-${primary}-${isDark ? '400' : '300'}`,
    accent: `text-${accent}-${isDark ? '400' : '600'} hover:text-${accent}-${isDark ? '300' : '800'}`,
    font: `font-${options.font}`,
    bodyFont: getFontFamily(options.font)
  }
}

function getFontFamily(fontType: SmartThemeOptions['font']): string {
  switch (fontType) {
    case 'mono': return "'JetBrains Mono', 'Courier New', monospace"
    case 'serif': return "'Georgia', 'Times New Roman', serif"
    default: return "'Inter', 'Segoe UI', sans-serif"
  }
}
