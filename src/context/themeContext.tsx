import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface ThemeContextType {
  isDark: boolean
  toggleNightMode: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nightMode')
      if (stored !== null) setIsDark(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('nightMode', JSON.stringify(isDark))
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleNightMode = () => setIsDark((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleNightMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeSwitch = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useThemeSwitch must be used within a ThemeProvider')
  return context
}
