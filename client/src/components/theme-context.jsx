import { createContext, useContext, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [colorTheme, setColorTheme] = useState("default")

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