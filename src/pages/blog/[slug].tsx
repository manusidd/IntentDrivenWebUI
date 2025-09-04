import Layout from '../../components/Layout'
import { getPostSlugs, getPostBySlug, getAllPosts } from '../../../lib/posts'
import Head from 'next/head'
import { MDXRemote } from 'next-mdx-remote'
import { useTheme } from '../../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import PostList from '../../components/PostList'

export default function Post({ source, frontMatter, allPosts }: any) {
  const { theme, generateBlogSuggestions } = useTheme()
  const [suggestedPosts, setSuggestedPosts] = useState<any[]>([])
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    // Listen for mood input from the ThemeSwitcher
    const handleMoodInput = async (event: Event) => {
      const customEvent = event as CustomEvent
      const prompt = customEvent.detail.prompt
      console.log('🎯 Blog page received mood input:', prompt)
      
      // If prompt is empty, clear suggestions
      if (!prompt || prompt.trim() === '') {
        console.log('🧹 Empty prompt - clearing suggestions')
        setSuggestedPosts([])
        setCurrentSuggestions([])
        setShowSuggestions(false)
        return
      }
      
      try {
        const suggestions = await generateBlogSuggestions(prompt)
        console.log('📝 Generated suggestions:', suggestions)
        setCurrentSuggestions(suggestions)
        
        // Filter posts based on suggestions (exclude current post)
        const filtered = allPosts.filter((post: any) => {
          if (post.slug === frontMatter?.slug) return false // Exclude current post
          
          const postContent = (post.title + ' ' + post.excerpt + ' ' + (post.category || '')).toLowerCase()
          return suggestions.some(suggestion => 
            postContent.includes(suggestion.toLowerCase()) ||
            suggestion.toLowerCase().includes(postContent.split(' ')[0]) // partial matching
          )
        })
        
        console.log('🔍 Filtered suggested posts:', filtered.length, 'out of', allPosts.length)
        setSuggestedPosts(filtered.slice(0, 3)) // Show max 3 suggestions
        setShowSuggestions(true)
        
      } catch (error) {
        console.error('💥 Failed to generate suggestions:', error)
        setSuggestedPosts([])
      }
    }

    // Add custom event listener
    window.addEventListener('moodInput', handleMoodInput)
    
    return () => {
      window.removeEventListener('moodInput', handleMoodInput)
    }
  }, [allPosts, generateBlogSuggestions, frontMatter?.slug])

  const clearSuggestions = () => {
    setSuggestedPosts([])
    setCurrentSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <Layout isBlogPost={true}>
      <Head>
        <title>{frontMatter?.title}</title>
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Main Article */}
        <article className="mb-12">
          <div className={`${theme.card} border rounded-2xl p-8 shadow-2xl backdrop-blur-md ${theme.font} ${theme.textShadow || ''}`}>
            <h1 className={`text-3xl font-bold mb-6 ${theme.accent || theme.text} leading-tight`}>
              {frontMatter?.title}
            </h1>
            {frontMatter?.category && (
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full ${theme.button} text-sm font-medium`}>
                  {frontMatter.category}
                </span>
              </div>
            )}
            <div className={`prose prose-lg max-w-none ${theme.text} leading-relaxed`}>
              <MDXRemote {...source} />
            </div>
          </div>
        </article>

        {/* Mood-Based Suggestions */}
        {showSuggestions && (
          <section className="mb-8">
            <div className={`${theme.card} border rounded-2xl p-6 shadow-xl backdrop-blur-md`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${theme.accent || theme.text} ${theme.font}`}>
                  Based on your mood, you might enjoy...
                </h2>
                <button 
                  onClick={clearSuggestions}
                  className={`text-sm opacity-60 hover:opacity-100 underline ${theme.text}`}
                >
                  clear suggestions
                </button>
              </div>
              
              {/* Suggestion Pills */}
              {currentSuggestions.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {currentSuggestions.map((suggestion, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${theme.button} ${theme.font}`}
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Suggested Posts */}
              {suggestedPosts.length > 0 ? (
                <PostList posts={suggestedPosts} />
              ) : (
                <p className={`${theme.text} opacity-70 text-center py-4`}>
                  No related posts found. Try expressing a different mood!
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const slugs = getPostSlugs()
  return {
    paths: slugs.map((s: string) => ({ params: { slug: s } })),
    fallback: false
  }
}

export async function getStaticProps({ params }: any) {
  const { slug } = params
  const post = await getPostBySlug(slug)
  const allPosts = getAllPosts()
  
  return {
    props: {
      source: post.content,
      frontMatter: { ...post.frontMatter, slug }, // Include slug for filtering
      allPosts
    }
  }
}
