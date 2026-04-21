"use client"

import { useState } from "react"
import { 
  Trophy, Shield, Terminal, Lock, Zap, Target, Award, Star,
  Bug, Code, Eye, Wifi, Database, Key, Skull, Flame, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  category: "baslangic" | "kriptografi" | "web" | "ag" | "ozel"
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  xp: number
}

const achievements: Achievement[] = [
  {
    id: "first-login",
    name: "Ilk Adim",
    description: "Platforma ilk giris",
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    category: "baslangic",
    unlocked: true,
    rarity: "common",
    xp: 10
  },
  {
    id: "first-lab",
    name: "Lab Kacagi",
    description: "Ilk lab'i tamamla",
    icon: Terminal,
    color: "text-cyber-green",
    bgColor: "bg-cyber-green/10",
    category: "baslangic",
    unlocked: true,
    rarity: "common",
    xp: 25
  },
  {
    id: "hash-master",
    name: "Hash Kirici",
    description: "5 farkli hash tur coz",
    icon: Lock,
    color: "text-cyber-blue",
    bgColor: "bg-cyber-blue/10",
    category: "kriptografi",
    unlocked: true,
    rarity: "rare",
    xp: 100
  },
  {
    id: "sql-ninja",
    name: "SQL Ninja",
    description: "SQL Injection lab'ini tamamla",
    icon: Database,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    category: "web",
    unlocked: false,
    rarity: "rare",
    xp: 150
  },
  {
    id: "network-analyst",
    name: "Ag Analizcisi",
    description: "Ag analiz lab'ini tamamla",
    icon: Wifi,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    category: "ag",
    unlocked: false,
    rarity: "rare",
    xp: 150
  },
  {
    id: "bug-hunter",
    name: "Bug Avcisi",
    description: "10 guvenlik acigi bul",
    icon: Bug,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    category: "web",
    unlocked: true,
    rarity: "epic",
    xp: 250
  },
  {
    id: "code-breaker",
    name: "Sifre Kirici",
    description: "Tum kriptografi lab'larini tamamla",
    icon: Key,
    color: "text-cyber-pink",
    bgColor: "bg-cyber-pink/10",
    category: "kriptografi",
    unlocked: false,
    rarity: "epic",
    xp: 300
  },
  {
    id: "speed-demon",
    name: "Hiz Seytani",
    description: "Bir lab'i 5 dakikadan kisa surede tamamla",
    icon: Zap,
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
    category: "ozel",
    unlocked: true,
    rarity: "rare",
    xp: 100
  },
  {
    id: "streak-master",
    name: "Seri Ustasi",
    description: "7 gun ust uste giris yap",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    category: "ozel",
    unlocked: true,
    rarity: "epic",
    xp: 200
  },
  {
    id: "elite-hacker",
    name: "Elit Hacker",
    description: "Tum lab'lari tamamla",
    icon: Skull,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    category: "ozel",
    unlocked: false,
    rarity: "legendary",
    xp: 1000
  },
  {
    id: "champion",
    name: "Sampiyon",
    description: "Liderlik tablosunda ilk 3'e gir",
    icon: Crown,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    category: "ozel",
    unlocked: false,
    rarity: "legendary",
    xp: 500
  },
  {
    id: "perfect-score",
    name: "Mukemmel Skor",
    description: "Bir lab'i sifir hata ile tamamla",
    icon: Target,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    category: "ozel",
    unlocked: true,
    rarity: "rare",
    xp: 75
  },
]

const categories = [
  { id: "all", label: "Tumu" },
  { id: "baslangic", label: "Baslangic" },
  { id: "kriptografi", label: "Kriptografi" },
  { id: "web", label: "Web" },
  { id: "ag", label: "Ag" },
  { id: "ozel", label: "Ozel" },
]

const rarityColors = {
  common: "border-gray-500/50",
  rare: "border-cyber-blue/50",
  epic: "border-cyber-purple/50",
  legendary: "border-amber-400/50 shadow-amber-400/20 shadow-lg"
}

const rarityLabels = {
  common: "Yaygin",
  rare: "Nadir",
  epic: "Epik",
  legendary: "Efsanevi"
}

export function AchievementsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const filteredAchievements = achievements.filter(a => 
    selectedCategory === "all" || a.category === selectedCategory
  )
  
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0)

  return (
    <section className="py-20 relative" id="rozetler">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 mb-4">
            <Trophy className="w-4 h-4 text-cyber-purple" />
            <span className="text-sm text-cyber-purple font-medium">Basari Sistemi</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Rozetler & <span className="text-gradient">Basarilar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lab&apos;lari tamamla, rozetler kazan ve liderlik tablosunda yuksel!
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyber-blue">{unlockedCount}/{achievements.length}</p>
              <p className="text-xs text-muted-foreground">Rozet Acildi</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-cyber-green">{totalXP}</p>
              <p className="text-xs text-muted-foreground">Toplam XP</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id 
                ? "bg-cyber-blue text-cyber-dark" 
                : "border-border/50 hover:border-cyber-blue/50"
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative group p-4 rounded-xl border-2 transition-all duration-300 ${
                achievement.unlocked 
                  ? `glass-effect ${rarityColors[achievement.rarity]} hover:scale-105` 
                  : "bg-muted/20 border-muted/30 opacity-50"
              }`}
            >
              {/* Rarity indicator */}
              {achievement.unlocked && achievement.rarity !== "common" && (
                <div className={`absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  achievement.rarity === "rare" ? "bg-cyber-blue text-cyber-dark" :
                  achievement.rarity === "epic" ? "bg-cyber-purple text-white" :
                  "bg-amber-400 text-cyber-dark animate-pulse"
                }`}>
                  {rarityLabels[achievement.rarity]}
                </div>
              )}
              
              {/* Icon */}
              <div className={`w-12 h-12 mx-auto rounded-xl ${achievement.unlocked ? achievement.bgColor : "bg-muted/30"} flex items-center justify-center mb-3`}>
                <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? achievement.color : "text-muted-foreground"}`} />
              </div>
              
              {/* Info */}
              <h3 className={`text-sm font-semibold text-center mb-1 ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                {achievement.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center line-clamp-2">
                {achievement.description}
              </p>
              
              {/* XP */}
              {achievement.unlocked && (
                <p className="text-xs text-cyber-green text-center mt-2 font-semibold">
                  +{achievement.xp} XP
                </p>
              )}
              
              {/* Lock overlay */}
              {!achievement.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
