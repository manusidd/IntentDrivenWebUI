import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

export function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory).map((file) => file.replace(/\.mdx?$/, ''))
  } catch (e) {
    return []
  }
}

export function getAllPosts() {
  const slugs = getPostSlugs()
  const posts = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Generate a longer excerpt from content if not provided in frontmatter
    let excerpt = data.excerpt || ''
    if (!excerpt && content) {
      // Remove markdown syntax and get first 200 characters
      const plainText = content
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
      
      excerpt = plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText
    }
    
    return {
      slug,
      title: data.title || slug,
      excerpt,
      date: data.date || null,
      category: data.category || null
    }
  })

  posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  return posts
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const mdxSource = await serialize(content, {
    mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [] }
  })

  return { frontMatter: data, content: mdxSource }
}
