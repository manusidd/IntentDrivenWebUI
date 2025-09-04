import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'

export default function PostList({ posts = [] }: { posts?: any[] }) {
  const { theme } = useTheme()

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link 
            href={`/blog/${post.slug}`} 
            className={`group block p-6 rounded-xl ${theme.card} border hover:shadow-2xl transition-all duration-500 ${theme.font} no-ripple hover:scale-[1.05] transform ${theme.textShadow || ''} hover:border-opacity-60`}
          >
            <h2 className={`text-xl font-semibold ${theme.accent || theme.text} mb-3 group-hover:text-2xl transition-all duration-300`}>
              {post.title}
            </h2>
            <p className={`text-base ${theme.text} opacity-80 leading-relaxed group-hover:opacity-100 transition-all duration-300 group-hover:text-lg mb-4`}>
              {post.excerpt}
            </p>
            <div className={`text-sm ${theme.text} opacity-60 mt-4 group-hover:opacity-80 transition-all duration-300`}>
              {post.category && (
                <span className={`inline-block px-3 py-1 rounded-full ${theme.button} text-sm mr-3 group-hover:scale-110 transition-transform duration-300`}>
                  {post.category}
                </span>
              )}
              <span className="group-hover:translate-x-2 inline-block transition-transform duration-300">
                Read more →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
