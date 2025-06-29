import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

const COLOR_THEME_KEY = "dataviz-color-theme"

export function ThemeProvider({ children }) {
  const [colorTheme, setColorThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(COLOR_THEME_KEY) || "default"
    }
    return "default"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(COLOR_THEME_KEY, colorTheme)
    }
  }, [colorTheme])

  const setColorTheme = (theme) => {
    setColorThemeState(theme)
    // localStorage is updated by useEffect
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useColorTheme must be used within a ThemeProvider")
  }
  return context
} 