# QN Blog (Next.js + TypeScript + Tailwind + MDX)

This is a minimal blog scaffold using Next.js, TypeScript, Tailwind CSS and MDX for content.

Quick start (Windows PowerShell):

1. Open PowerShell and navigate to the project folder

   Set-Location -Path "<path>\\web"

2. Install dependencies

   npm install

3. Start the dev server

   npm run dev

4. # QN Web - AI-Powered Therapeutic Blog Platform

![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)
![WebLLM](https://img.shields.io/badge/WebLLM-AI_Powered-green?style=flat-square)

A unique blog platform that combines therapeutic content with AI-powered mood detection, featuring 10 therapeutic themes and an interactive expression tool.

## ✨ Features

### 🧠 **AI-Powered Mood Detection**
- Client-side AI using WebLLM for privacy-first mood analysis
- Compensatory theme selection based on emotional state
- Smart blog filtering based on current mood

### 🎨 **10 Therapeutic Themes**
- **Beach** - Calming oceanic vibes
- **Autumn** - Warm, grounding nature themes
- **Space** - Expansive, contemplative cosmic aesthetics
- **Dark** - Professional, focused environments
- **Desert** - Minimalist, serene landscapes
- **Pastel** - Soft, gentle color palettes
- **Corporate** - Clean, professional styling
- **Festive** - Joyful, celebration-ready themes
- **Kids** - Playful, colorful designs
- **Rainforest** - Lush, vibrant natural themes

### 💌 **Express Yourself Tool**
- AI-driven dynamic form generation
- Intelligent poster card creator
- Natural language processing for form field detection
- Multiple visual style variations (bold, warm, soft, minimal)

### 🎵 **Interactive Elements**
- Custom Christmas chime sound effects
- Smooth ripple animations
- Responsive design with mobile navigation
- Theme-aware styling throughout

## 🛠 Technologies Used

- **Framework**: Next.js 13.5.6 with TypeScript
- **Styling**: Tailwind CSS 3.3.0
- **AI/ML**: @mlc-ai/web-llm for client-side processing
- **Content**: MDX for blog posts
- **Audio**: Web Audio API for custom sound effects
- **State Management**: React Context for theme management

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/qn-web.git
   cd qn-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
qn-web/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx      # Navigation with theme integration
│   │   ├── Layout.tsx      # Main layout with sound effects
│   │   ├── ThemeSwitcher.tsx # AI mood detection input
│   │   └── ...
│   ├── contexts/           # React Context providers
│   │   └── ThemeContext.tsx # Theme management & AI integration
│   ├── hooks/              # Custom React hooks
│   │   ├── useWebLLM.ts   # WebLLM integration
│   │   └── useTheme.ts    # Theme utilities
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx      # Home page with blog list
│   │   ├── express.tsx    # Interactive poster creator
│   │   └── blog/[slug].tsx # Dynamic blog post pages
│   └── utils/              # Utility functions
├── content/blog/           # MDX blog posts
├── public/                 # Static assets
│   ├── mock-govt-portal1.html # Government portal demos
│   ├── mock-govt-portal2.html
│   └── workers/           # Web Workers
└── lib/                   # Content processing utilities
```

## 🎯 Key Features Explained

### Therapeutic Theme System
The platform uses a sophisticated 10-theme system designed for emotional wellness:
- Each theme has carefully selected colors, fonts, and imagery
- AI analyzes user input to suggest compensatory themes
- Themes adapt based on current emotional state

### AI-Powered Expression Tool
- Natural language processing detects user intent
- Dynamically generates appropriate form fields
- Creates personalized poster cards with style variations
- Supports various emotional expressions (celebrations, apologies, gratitude, etc.)

### Mood-Based Content Filtering
- Blog posts can be filtered based on emotional state
- AI suggests relevant content for current mood
- Seamless integration between mood detection and content discovery

## 🔊 Audio Features

The platform includes custom Web Audio API implementations:
- **Christmas Chime**: Pleasant bell harmonies on interactions
- **Therapeutic Soundscape**: Calming audio feedback
- **Accessible Controls**: Respects user preferences

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Adaptive navigation with hamburger menu
- Touch-friendly interactions
- Theme-aware responsive breakpoints

## 🤖 AI Integration

### WebLLM Implementation
- Client-side processing for privacy
- No data sent to external servers
- Real-time mood analysis
- Compensatory theme suggestions

### Smart Content Generation
- Dynamic form field creation
- Context-aware placeholder text
- Intelligent style detection
- Natural language understanding

## 🎨 Customization

### Adding New Themes
1. Define theme in `src/contexts/ThemeContext.tsx`
2. Add corresponding mood mapping
3. Update theme selection logic

### Creating Blog Posts
1. Add MDX files to `content/blog/`
2. Include frontmatter metadata
3. Use therapeutic tagging for mood-based filtering

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Inspiration

This project combines the therapeutic benefits of expressive writing with modern AI technology, creating a platform that truly understands and responds to human emotional needs.

## 📧 Contact

For questions or collaboration opportunities, feel free to reach out through the platform's contact form or create an issue in this repository.

---

*Built with ❤️ for human connection and emotional wellness*

Deploy
------

- The easiest deployment is to Vercel. Create a Vercel account and import the repository.
- Alternatively, you can build with `npm run build` and serve with `npm run start`.

Notes
-----
- Blog posts live in `content/blog` as MDX files. Add new `.mdx` files with frontmatter `title`, `date`, and `excerpt`.
- If you want me to install dependencies and start the dev server now, say "Yes, install and run".
