"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { 
  Shield, Terminal, Trophy, Flame, Star, Target, Lock, Zap,
  ArrowLeft, Settings, Calendar, Clock, Award, TrendingUp,
  CheckCircle2, BookOpen, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface Profile {
  id: string
  username: string
  level: number
  xp: number
  badges: string[]
  completed_labs: string[]
  certificates: string[]
  streak: number
  created_at: string
  is_admin: boolean
}

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"genel" | "lablar" | "sertifikalar">("genel")
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/giris")
        return
      }
      
      setUser(user)
      
      // Get profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
      }
      
      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-blue mx-auto mb-4" />
          <p className="text-muted-foreground">Profil yukleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const xpToNextLevel = (profile.level + 1) * 500
  const xpProgress = (profile.xp / xpToNextLevel) * 100
  const joinDate = new Date(profile.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-gray via-cyber-dark to-cyber-dark -z-10" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Ana Sayfa
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyber-blue" />
              <span className="font-bold text-sm">
                <span className="text-cyber-blue">who</span>
                <span className="text-cyber-purple">am</span>
                <span className="text-cyber-pink">i</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="glass-effect rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyber-blue via-cyber-purple to-cyber-pink p-1">
                <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-gradient">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-cyber-green text-cyber-dark text-xs font-bold px-2 py-1 rounded-full">
                Lvl {profile.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.username}</h1>
                {profile.is_admin && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30 rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-3">{user.email}</p>
              
              {/* XP Bar */}
              <div className="max-w-md">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Seviye {profile.level}</span>
                  <span className="text-cyber-green">{profile.xp} / {xpToNextLevel} XP</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(xpProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{profile.streak}</p>
                <p className="text-xs text-muted-foreground">Gun Seri</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/20">
                <CheckCircle2 className="w-5 h-5 text-cyber-green mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{profile.completed_labs?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Lab</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-cyber-blue/10 border border-cyber-blue/20">
                <Trophy className="w-5 h-5 text-cyber-blue mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{profile.badges?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Rozet</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-cyber-purple/10 border border-cyber-purple/20">
                <Award className="w-5 h-5 text-cyber-purple mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{profile.certificates?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Sertifika</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "genel", label: "Genel Bakis", icon: Target },
            { id: "lablar", label: "Tamamlanan Lablar", icon: Terminal },
            { id: "sertifikalar", label: "Sertifikalar", icon: Award },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-cyber-blue text-cyber-dark" : ""}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "genel" && (
              <>
                {/* Progress Overview */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyber-blue" />
                    Ilerleme Durumu
                  </h3>
                  
                  {profile.completed_labs?.length > 0 || profile.badges?.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Siber guvenlik yolculugunda ilerliyorsun! Lablar tamamlayarak ve rozetler kazanarak deneyim puani kazan.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-cyber-green/10 border border-cyber-green/20">
                          <p className="text-2xl font-bold text-cyber-green">{profile.xp}</p>
                          <p className="text-sm text-muted-foreground">Toplam XP</p>
                        </div>
                        <div className="p-4 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20">
                          <p className="text-2xl font-bold text-cyber-blue">{profile.level}</p>
                          <p className="text-sm text-muted-foreground">Seviye</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Henuz Basladin!</h4>
                      <p className="text-muted-foreground mb-4">
                        Ilk labini tamamlayarak siber guvenlik yolculuguna basla.
                      </p>
                      <Link href="/#lablar">
                        <Button className="bg-gradient-to-r from-cyber-blue to-cyber-purple">
                          Lablari Kesfet
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Rozetlerim
                  </h3>
                  
                  {profile.badges?.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {profile.badges.map((badge, idx) => (
                        <div key={idx} className="text-center p-3 rounded-lg bg-amber-400/10 border border-amber-400/20">
                          <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <p className="text-xs text-foreground">{badge}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        Henuz rozet kazanmadin. Lablar tamamlayarak rozet kazan!
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "lablar" && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyber-green" />
                  Tamamlanan Lablar
                </h3>
                
                {profile.completed_labs?.length > 0 ? (
                  <div className="space-y-3">
                    {profile.completed_labs.map((lab, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-green to-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{lab}</p>
                          <p className="text-xs text-muted-foreground">Tamamlandi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Terminal className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Henuz Lab Tamamlanmadi</h4>
                    <p className="text-muted-foreground mb-4">
                      Ilk labini tamamla ve burada goruntule!
                    </p>
                    <Link href="/#lablar">
                      <Button className="bg-gradient-to-r from-cyber-blue to-cyber-purple">
                        Lablara Git
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "sertifikalar" && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Sertifikalarim
                </h3>
                
                {profile.certificates?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.certificates.map((cert, idx) => (
                      <div key={idx} className="p-4 rounded-xl border-2 border-amber-400/30 bg-amber-400/5">
                        <div className="flex items-center gap-3 mb-3">
                          <Award className="w-8 h-8 text-amber-400" />
                          <div>
                            <p className="font-semibold text-foreground">{cert}</p>
                            <p className="text-xs text-muted-foreground">Sertifika</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Henuz Sertifika Yok</h4>
                    <p className="text-muted-foreground mb-4">
                      Lablar tamamlayarak sertifika kazan!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats Card */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Istatistikler
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Katilim Tarihi</span>
                  <span className="text-foreground font-medium">{joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Toplam XP</span>
                  <span className="text-cyber-green font-bold">{profile.xp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Seviye</span>
                  <span className="text-cyber-blue font-bold">{profile.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gunluk Seri</span>
                  <span className="text-orange-500 font-bold">{profile.streak} gun</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Hizli Erisim</h3>
              <div className="space-y-2">
                <Link href="/#lablar">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Terminal className="w-4 h-4" />
                    Lablara Git
                  </Button>
                </Link>
                <Link href="/#rozetler">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Trophy className="w-4 h-4" />
                    Rozetler
                  </Button>
                </Link>
                <Link href="/#mufredat">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mufredat
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
