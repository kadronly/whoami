"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-9 h-9 rounded-full border border-border/50"
      >
        <span className="sr-only">Tema Yukleniyor</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full border border-border/50 hover:border-cyber-blue/50 hover:bg-cyber-blue/10 transition-all duration-300"
      title={theme === "dark" ? "Aydinlik Moda Gec" : "Karanlik Moda Gec"}
    >
      <Sun className={`h-4 w-4 text-yellow-500 transition-all duration-300 ${theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"} absolute`} />
      <Moon className={`h-4 w-4 text-cyber-purple transition-all duration-300 ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"} absolute`} />
      <span className="sr-only">Tema Degistir</span>
    </Button>
  )
}
