import { useTheme } from '../contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className={`${theme.header} border-t mt-8`}>
      <div className={`max-w-3xl mx-auto p-3 text-center text-xs ${theme.text} ${theme.font} opacity-75`}>
        © {new Date().getFullYear()} My Blog
      </div>
    </footer>
  )
}
