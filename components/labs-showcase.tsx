"use client"

import { useState, useEffect } from "react"
import { Terminal, Flag, Users, Timer, ChevronRight, Zap, Lock, Globe, Server, Database, Monitor, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"

const labs = [
  { id: 1, title: "Parola Kırıcı", description: "İzole terminalde MD5 hash'i analiz et, wordlist ile parolayı bul ve flagi yakala.", category: "Kriptografi", difficulty: "Kolay", points: 100, solvers: 1247, estimatedTime: "10 dk", icon: Lock, color: "from-green-500 to-emerald-500", tags: ["MD5", "Hashcat", "Terminal"], isActive: true },
  { id: 2, title: "Paket Analizi", description: "İzole terminal laboratuvarında PCAP izlerini incele ve sızdırılan bilgiyi tespit et.", category: "Adli Bilişim", difficulty: "Orta", points: 200, solvers: 623, estimatedTime: "20 dk", icon: Globe, color: "from-cyan-500 to-blue-500", tags: ["HTTP", "PCAP", "Wireshark"], isActive: true },
  { id: 3, title: "SQL Enjeksiyonu", description: "İzole veritabanı terminalinde savunmasız sorguyu analiz ederek admin kaydını bul.", category: "Web", difficulty: "Zor", points: 300, solvers: 234, estimatedTime: "30 dk", icon: Database, color: "from-cyber-purple to-violet-500", tags: ["SQL", "Injection", "Terminal"], isActive: true },
  { id: 4, title: "Linux Yetki Yükseltme", description: "İzole Linux terminalinde SUID yanlış yapılandırmasını bul ve root flagini oku.", category: "Linux", difficulty: "Zor", points: 250, solvers: 412, estimatedTime: "25 dk", icon: Server, color: "from-orange-500 to-red-500", tags: ["Linux", "SUID", "Privilege Escalation"], isActive: true },
  { id: 5, title: "Yetki Merdiveni", description: "Yanlış yapılandırılmış dosya izinlerini analiz ederek yetki yükseltme yolunu bul.", category: "Linux", difficulty: "Zor", points: 250, solvers: 412, estimatedTime: "25 dk", icon: Server, color: "from-orange-500 to-red-500", tags: ["Linux", "SUID", "Permissions"], isActive: true },
  { id: 6, title: "SQL Sızıntısı", description: "Girdi doğrulaması eksik web uygulamasındaki veri sızıntısını tespit et.", category: "Web", difficulty: "Zor", points: 300, solvers: 234, estimatedTime: "30 dk", icon: Database, color: "from-cyber-purple to-violet-500", tags: ["SQL", "Injection", "Validation"], isActive: true },
  { id: 7, title: "Assembly Kapısı", description: "CMP ve JNE talimatlarını takip ederek programın kontrol akışını çöz.", category: "Reverse Engineering", difficulty: "Uzman", points: 400, solvers: 118, estimatedTime: "40 dk", icon: Terminal, color: "from-fuchsia-500 to-purple-600", tags: ["Assembly", "GDB", "Reverse"], isActive: true },
  { id: 8, title: "Bulut İzi", description: "Kimlik doğrulama sınırlarını incele ve açık metadata erişimini güvenli hale getir.", category: "Cloud", difficulty: "Uzman", points: 500, solvers: 76, estimatedTime: "45 dk", icon: Zap, color: "from-pink-500 to-rose-600", tags: ["Metadata", "IAM", "Cloud"], isActive: true },
]

const categories = ["Tümü", "Encoding", "Web", "Kriptografi", "Adli Bilişim", "Linux", "Reverse Engineering", "Cloud"]

interface LabsShowcaseProps {
  onOpenTerminal?: () => void
  onOpenPasswordLab?: () => void
  onOpenNetworkLab?: () => void
  onOpenSQLLab?: () => void
  onOpenLinuxLab?: () => void
}

export function LabsShowcase({ onOpenTerminal, onOpenPasswordLab, onOpenNetworkLab, onOpenSQLLab, onOpenLinuxLab }: LabsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("Tümü")
  const [user, setUser] = useState<User | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLabClick = (labId: number, openLabFn?: () => void) => {
    if (!user) {
      setShowAuthPrompt(true)
      return
    }
    if (openLabFn) {
      openLabFn()
    }
  }

  const filteredLabs = activeCategory === "Tümü" ? labs : labs.filter((lab) => lab.category === activeCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Kolay":
        return "text-cyber-green bg-cyber-green/10 border-cyber-green/30"
      case "Orta":
        return "text-cyber-blue bg-cyber-blue/10 border-cyber-blue/30"
      case "Zor":
        return "text-cyber-pink bg-cyber-pink/10 border-cyber-pink/30"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <section id="lablar" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-gray/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-effect text-cyber-green text-sm font-medium mb-4">
            Pratik Yaparak Öğren
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">İnteraktif Lablar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HackTheBox ve TryHackMe tarzı gerçekçi senaryolarla siber güvenlik becerilerini geliştir
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark"
                  : "glass-effect text-muted-foreground hover:text-cyber-blue"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredLabs.map((lab) => (
            <div key={lab.id} className="group relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${lab.color} rounded-2xl blur-xl ${lab.isActive ? "opacity-20" : "opacity-0"} group-hover:opacity-20 transition-opacity duration-500`}
              />
              <div className={`relative glass-effect rounded-2xl p-6 border transition-all duration-300 h-full ${lab.isActive ? "border-cyber-green/50 ring-1 ring-cyber-green/20" : "border-cyber-blue/10 group-hover:border-cyber-blue/30"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${lab.color}`}>
                      <lab.icon className="w-6 h-6 text-white" />
                    </div>
                    {lab.isActive && (
                      <span className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-cyber-green text-cyber-dark font-bold animate-pulse">
                        AKTIF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(lab.difficulty)}`}>
                      {lab.difficulty}
                    </span>
                    <span className="text-cyber-purple font-bold text-sm">+{lab.points} XP</span>
                  </div>
                </div>

                <span className="text-xs text-cyber-blue font-medium">{lab.category}</span>
                <h3 className="text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-cyber-blue transition-colors">
                  {lab.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{lab.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {lab.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {lab.solvers} çözdü
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {lab.estimatedTime}
                    </span>
                  </div>
                  {lab.id === 1 && onOpenPasswordLab ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleLabClick(lab.id, onOpenPasswordLab)}
                      className="bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-semibold group/btn"
                    >
                      {user ? "Basla" : "Giris Yap"}
                      {user ? (
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      ) : (
                        <LogIn className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  ) : lab.id === 2 && onOpenNetworkLab ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleLabClick(lab.id, onOpenNetworkLab)}
                      className="bg-cyber-blue hover:bg-cyber-blue/90 text-cyber-dark font-semibold group/btn"
                    >
                      {user ? "Basla" : "Giris Yap"}
                      {user ? (
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      ) : (
                        <LogIn className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  ) : lab.id === 3 && onOpenSQLLab ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleLabClick(lab.id, onOpenSQLLab)}
                      className="bg-cyber-purple hover:bg-cyber-purple/90 text-white font-semibold group/btn"
                    >
                      {user ? "Basla" : "Giris Yap"}
                      {user ? (
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      ) : (
                        <LogIn className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  ) : lab.id === 4 && onOpenLinuxLab ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleLabClick(lab.id, onOpenLinuxLab)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold group/btn"
                    >
                      {user ? "Basla" : "Giris Yap"}
                      {user ? (
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      ) : (
                        <LogIn className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById("ctf-challenge")?.scrollIntoView({ behavior: "smooth" })}
                      className="border-cyber-blue/40 text-cyber-blue hover:bg-cyber-blue/10 font-semibold"
                    >
                      CTF&apos;de Çöz <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="cyber-border rounded-xl overflow-hidden">
            <div className="bg-cyber-gray/80 px-4 py-3 flex items-center gap-2 border-b border-cyber-blue/20">
              <Terminal className="w-4 h-4 text-cyber-blue" />
              <span className="text-sm text-muted-foreground font-mono">Lab Terminal - SQL Avcısı</span>
              <div className="ml-auto flex items-center gap-2">
                <Flag className="w-4 h-4 text-cyber-green" />
                <span className="text-xs text-cyber-green">FLAG{"{...}"}</span>
              </div>
            </div>
            <div className="bg-cyber-dark/90 p-6 font-mono text-sm">
              <div className="text-muted-foreground mb-3">{"// Hedef: Kullanıcı tablosundan admin şifresini çek"}</div>
              <div className="flex items-center gap-2 text-cyber-green mb-2">
                <span className="text-cyber-blue">┌──(student㉿whoami)-[~/lab]</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-cyber-blue">└─$</span>
                <span className="text-foreground">{"sqlmap -u 'http://target/login.php?id=1' --dbs"}</span>
              </div>
              <div className="text-cyber-purple mb-2">[*] Veritabanları tespit edildi: users_db, admin_db</div>
              <div className="text-cyber-green">[+] İpucu: admin_db veritabanındaki credentials tablosunu incele</div>
            </div>
          </div>
        </div>

        {/* Prototip Terminal Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-green to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative glass-effect rounded-2xl p-8 border border-cyber-green/30 group-hover:border-cyber-green/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyber-green to-emerald-500 shrink-0">
                  <Monitor className="w-10 h-10 text-cyber-dark" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-cyber-green/20 text-cyber-green border border-cyber-green/30">
                      YENİ
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                      Etkileşimli
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Prototip Terminal</h3>
                  <p className="text-muted-foreground mb-4">
                    Gerçek bir Linux terminal deneyimi yaşayın. Temel komutları öğrenin, dosya sisteminde gezinin ve siber güvenlik becerilerinizi geliştirin. Kurulumsuz, tarayıcı tabanlı terminal ortamı.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">ls</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">cd</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">cat</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">pwd</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">netstat</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-cyber-dark text-muted-foreground">whoami</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={onOpenTerminal}
                  className="bg-gradient-to-r from-cyber-green to-emerald-500 hover:opacity-90 text-cyber-dark font-bold px-8 group/btn shrink-0"
                >
                  <Terminal className="w-5 h-5 mr-2" />
                  Terminale Git
                  <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => document.getElementById("ctf-challenge")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-cyber-dark font-bold px-8"
          >
            <Zap className="w-5 h-5 mr-2" />
            Tum Lablari Kesfet
          </Button>
        </div>
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAuthPrompt(false)}
          />
          <div className="relative glass-effect rounded-2xl p-8 max-w-md w-full border border-cyber-blue/30 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple flex items-center justify-center">
                <Lock className="w-8 h-8 text-cyber-dark" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Lab Erisimi Icin Giris Yap
              </h3>
              <p className="text-muted-foreground mb-6">
                Interaktif lablara erismek ve ilerlemeni kaydetmek icin ucretsiz hesap olustur veya giris yap.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    setShowAuthPrompt(false)
                    router.push("/auth/kayit")
                  }}
                  className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-cyber-dark font-semibold"
                >
                  Ucretsiz Kayit Ol
                </Button>
                <Button
                  onClick={() => {
                    setShowAuthPrompt(false)
                    router.push("/auth/giris")
                  }}
                  variant="outline"
                  className="w-full border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/10"
                >
                  Giris Yap
                </Button>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="text-sm text-muted-foreground hover:text-foreground mt-2"
                >
                  Daha sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
