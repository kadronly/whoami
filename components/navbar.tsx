"use client"

import { useState, useEffect } from "react"
import { Menu, X, Shield, Terminal, Play, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  is_admin: boolean
}

interface NavbarProps {
  onOpenDemo?: () => void
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user and check admin status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single()
        setIsAdmin(profile?.is_admin || false)
      }
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()
        setIsAdmin(profile?.is_admin || false)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const navLinks = [
    { href: "#misyon", label: "Misyon & Vizyon" },
    { href: "#mufredat", label: "Müfredat" },
    { href: "#lablar", label: "Lablar" },
    { href: "#ozellikler", label: "Özellikler" },
    { href: "#ekip", label: "Ekip" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-effect py-3 shadow-lg shadow-cyber-blue/10" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyber-blue transition-all duration-300 group-hover:text-cyber-purple" />
              <Terminal className="w-4 h-4 text-cyber-purple absolute -bottom-1 -right-1 transition-all duration-300 group-hover:text-cyber-blue" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-cyber-blue">who</span>
              <span className="text-cyber-purple">am</span>
              <span className="text-cyber-pink">i</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-cyber-blue transition-colors duration-300 relative group text-sm font-medium"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyber-blue to-cyber-purple transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {onOpenDemo && (
              <Button 
                onClick={onOpenDemo}
                variant="outline" 
                className="border-cyber-pink/50 text-cyber-pink hover:bg-cyber-pink/10 gap-2"
              >
                <Play className="w-4 h-4" />
                Demo
              </Button>
            )}
            {!loading && (
              user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" className="text-cyber-purple hover:text-cyber-purple hover:bg-cyber-purple/10 gap-2">
                        <Settings className="w-4 h-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/profil">
                    <Button variant="ghost" className="text-muted-foreground hover:text-cyber-blue hover:bg-cyber-blue/10 gap-2">
                      <User className="w-4 h-4" />
                      {user.user_metadata?.username || "Profil"}
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cikis
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/giris">
                    <Button variant="ghost" className="text-muted-foreground hover:text-cyber-blue hover:bg-cyber-blue/10">
                      Giris Yap
                    </Button>
                  </Link>
                  <Link href="/auth/kayit">
                    <Button className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-cyber-dark font-semibold px-6 animate-pulse-glow">
                      Kayit Ol
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          <button className="lg:hidden text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/50 pt-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-cyber-blue transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                {onOpenDemo && (
                  <Button 
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onOpenDemo()
                    }}
                    variant="outline" 
                    className="border-cyber-pink/50 text-cyber-pink bg-transparent gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Demo Modu
                  </Button>
                )}
                {!loading && (
                  user ? (
                    <>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full border-cyber-purple/50 text-cyber-purple bg-transparent gap-2">
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-cyber-blue/50 text-cyber-blue bg-transparent gap-2">
                          <User className="w-4 h-4" />
                          Profilim
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        variant="outline" 
                        className="border-red-500/50 text-red-400 bg-transparent gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Cikis Yap
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/giris" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-cyber-blue/50 text-cyber-blue bg-transparent">
                          Giris Yap
                        </Button>
                      </Link>
                      <Link href="/auth/kayit" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark font-semibold">
                          Kayit Ol
                        </Button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
