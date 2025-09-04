import Head from 'next/head'
import Layout from '../components/Layout'
import PostList from '../components/PostList'
import { getAllPosts } from '../../lib/posts'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

export default function Home({ posts }: { posts: any[] }) {
  const { theme, generateBlogSuggestions } = useTheme()
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([])
  const [isFilteringActive, setIsFilteringActive] = useState(false)

  useEffect(() => {
    // Listen for mood input from the ThemeSwitcher
    const handleMoodInput = async (event: Event) => {
      const customEvent = event as CustomEvent
      const prompt = customEvent.detail.prompt
      console.log('🎯 Home page received mood input:', prompt)
      
      // If prompt is empty, clear filters and show all posts
      if (!prompt || prompt.trim() === '') {
        console.log('🧹 Empty prompt - clearing filters, showing all posts')
        setFilteredPosts(posts)
        setCurrentSuggestions([])
        setIsFilteringActive(false)
        return
      }
      
      try {
        const suggestions = await generateBlogSuggestions(prompt)
        console.log('📝 Generated suggestions:', suggestions)
        setCurrentSuggestions(suggestions)
        
        // Filter posts based on suggestions
        const filtered = posts.filter(post => {
          const postContent = (post.title + ' ' + post.excerpt + ' ' + (post.category || '')).toLowerCase()
          return suggestions.some(suggestion => 
            postContent.includes(suggestion.toLowerCase()) ||
            suggestion.toLowerCase().includes(postContent.split(' ')[0]) // partial matching
          )
        })
        
        console.log('🔍 Filtered posts:', filtered.length, 'out of', posts.length)
        setFilteredPosts(filtered.length > 0 ? filtered : posts) // Show all if no matches
        setIsFilteringActive(true)
        
      } catch (error) {
        console.error('💥 Failed to generate suggestions:', error)
        setFilteredPosts(posts)
      }
    }

    // Add custom event listener
    window.addEventListener('moodInput', handleMoodInput)
    
    return () => {
      window.removeEventListener('moodInput', handleMoodInput)
    }
  }, [posts, generateBlogSuggestions])

  const clearFilter = () => {
    setFilteredPosts(posts)
    setCurrentSuggestions([])
    setIsFilteringActive(false)
  }

  return (
    <Layout>
      <Head>
        <title>I can't help but feel...</title>
      </Head>
      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className={`text-2xl font-bold mb-4 ${theme.text} ${theme.font}`}>I can't help but feel...</h1>
        
        {/* Suggestion Pills */}
        {isFilteringActive && currentSuggestions.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-white/70 backdrop-blur-sm border">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm ${theme.text} opacity-70`}>Showing posts related to:</span>
              <button 
                onClick={clearFilter}
                className="text-xs opacity-60 hover:opacity-100 underline"
              >
                clear filter
              </button>
            </div>
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
        
        <PostList posts={filteredPosts} />
        
        {filteredPosts.length === 0 && (
          <div className={`text-center py-8 ${theme.text} opacity-70`}>
            <p>No posts found matching your mood. Try a different expression!</p>
          </div>
        )}
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  return { props: { posts } }
}
