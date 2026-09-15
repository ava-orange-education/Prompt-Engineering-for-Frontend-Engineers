import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function getInitialPreference(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialPreference)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = useCallback(() => {
    setIsDark((d) => !d)
  }, [])

  return { isDark, toggle }
}
