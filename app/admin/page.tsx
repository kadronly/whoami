"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Shield, Terminal, Users, BookOpen, Award, TrendingUp, Settings, 
  BarChart3, Activity, Calendar, Bell, Search, Menu,
  ChevronDown, ArrowUpRight, Eye, Download, Filter,
  Clock, Target, Zap, CheckCircle2, AlertTriangle, Trash2, RefreshCw,
  UserX, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

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

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/giris")
      return
    }
    setUser(user)

    // Check if user is admin
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profileData?.is_admin) {
      router.push("/")
      return
    }
    setProfile(profileData)

    // Fetch all profiles
    await fetchAllProfiles()
    setLoading(false)
  }

  const fetchAllProfiles = async () => {
    setRefreshing(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setAllProfiles(data)
    }
    setRefreshing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getTotalStats = () => {
    const totalUsers = allProfiles.length
    const totalXP = allProfiles.reduce((sum, p) => sum + (p.xp || 0), 0)
    const totalLabs = allProfiles.reduce((sum, p) => sum + (p.completed_labs?.length || 0), 0)
    const totalCerts = allProfiles.reduce((sum, p) => sum + (p.certificates?.length || 0), 0)
    return { totalUsers, totalXP, totalLabs, totalCerts }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yukleniyor...</p>
        </div>
      </div>
    )
  }

  const stats = getTotalStats()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border/50 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyber-blue" />
              <Terminal className="w-4 h-4 text-cyber-purple absolute -bottom-1 -right-1" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-sm">
                  <span className="text-cyber-blue">who</span>
                  <span className="text-cyber-purple">am</span>
                  <span className="text-cyber-pink">i</span>
                </span>
                <p className="text-[10px] text-muted-foreground">Admin Paneli</p>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { icon: BarChart3, label: "Dashboard", active: true },
              { icon: Users, label: "Kullanicilar", active: false },
              { icon: Terminal, label: "Lablar", active: false },
              { icon: Award, label: "Sertifikalar", active: false },
              { icon: Settings, label: "Ayarlar", active: false },
            ].map((item, i) => (
              <li key={i}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active 
                    ? "bg-cyber-blue/10 text-cyber-blue" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin User */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile?.username}</p>
                <p className="text-xs text-cyber-purple truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline" size="sm">
                Siteye Don
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-cyber-blue/10">
                  <Users className="w-5 h-5 text-cyber-blue" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Toplam Kullanici</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-cyber-green/10">
                  <Zap className="w-5 h-5 text-cyber-green" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalXP.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Toplam XP</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-cyber-purple/10">
                  <Terminal className="w-5 h-5 text-cyber-purple" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalLabs}</p>
              <p className="text-sm text-muted-foreground">Tamamlanan Lab</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-cyber-pink/10">
                  <Award className="w-5 h-5 text-cyber-pink" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalCerts}</p>
              <p className="text-sm text-muted-foreground">Verilen Sertifika</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border/50 rounded-xl">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-cyber-blue" />
                Kayitli Kullanicilar ({allProfiles.length})
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAllProfiles}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Yenile
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border/50 bg-muted/30">
                    <th className="text-left p-4">Kullanici</th>
                    <th className="text-left p-4">Seviye</th>
                    <th className="text-left p-4">XP</th>
                    <th className="text-left p-4">Lab</th>
                    <th className="text-left p-4">Sertifika</th>
                    <th className="text-left p-4">Kayit Tarihi</th>
                    <th className="text-left p-4">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {allProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        Henuz kayitli kullanici yok
                      </td>
                    </tr>
                  ) : (
                    allProfiles.map((p) => (
                      <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              p.is_admin 
                                ? "bg-gradient-to-br from-cyber-purple to-cyber-pink" 
                                : "bg-gradient-to-br from-cyber-blue to-cyan-500"
                            }`}>
                              {p.is_admin ? (
                                <Crown className="w-5 h-5 text-white" />
                              ) : (
                                <span className="text-sm font-bold text-white">
                                  {p.username?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground flex items-center gap-2">
                                {p.username || "Isimsiz"}
                                {p.is_admin && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyber-purple/20 text-cyber-purple rounded">
                                    ADMIN
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">{p.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyber-blue/10 text-cyber-blue text-sm font-medium">
                            Lvl {p.level || 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-cyber-green font-medium">{(p.xp || 0).toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground">{p.completed_labs?.length || 0}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground">{p.certificates?.length || 0}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{formatDate(p.created_at)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            p.is_admin 
                              ? "bg-cyber-purple/20 text-cyber-purple" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {p.is_admin ? "Admin" : "Kullanici"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyber-green" />
                Aktif Lablar
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Parola Kirici", difficulty: "Kolay", color: "text-green-400" },
                  { name: "Ag Analizi", difficulty: "Orta", color: "text-yellow-400" },
                  { name: "SQL Injection", difficulty: "Orta", color: "text-yellow-400" },
                  { name: "Linux Privesc", difficulty: "Zor", color: "text-red-400" },
                ].map((lab, i) => (
                  <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-foreground">{lab.name}</span>
                    <span className={`text-xs font-medium ${lab.color}`}>{lab.difficulty}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyber-blue" />
                Sistem Durumu
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Veritabani</span>
                  <span className="flex items-center gap-2 text-cyber-green text-sm">
                    <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                    Aktif
                  </span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="flex items-center gap-2 text-cyber-green text-sm">
                    <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                    Aktif
                  </span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Lab Servisleri</span>
                  <span className="flex items-center gap-2 text-cyber-green text-sm">
                    <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                    Aktif
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
