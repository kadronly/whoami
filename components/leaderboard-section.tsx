"use client"

import { Trophy, Medal, Star, TrendingUp, Flame } from "lucide-react"

// Pre-formatted data to avoid hydration mismatch from toLocaleString
const topStudents = [
  { rank: 1, name: "CyberNinja_42", school: "Kadikoy Anadolu Lisesi", points: "15.420", streak: 28, badges: 24 },
  { rank: 2, name: "HackerGirl_TR", school: "Galatasaray Lisesi", points: "14.850", streak: 21, badges: 22 },
  { rank: 3, name: "ByteMaster", school: "Robert Kolej", points: "13.200", streak: 35, badges: 19 },
  { rank: 4, name: "CodeBreaker", school: "Istanbul Erkek Lisesi", points: "12.100", streak: 14, badges: 17 },
  { rank: 5, name: "SecureWolf", school: "Ankara Fen Lisesi", points: "11.500", streak: 19, badges: 16 },
]

export function LeaderboardSection() {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-amber-500"
      case 2:
        return "from-gray-300 to-gray-400"
      case 3:
        return "from-orange-400 to-orange-600"
      default:
        return "from-cyber-blue to-cyber-purple"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5" />
      case 2:
        return <Medal className="w-5 h-5" />
      case 3:
        return <Medal className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-purple/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-effect text-yellow-400 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 inline mr-2" />
            Sıralama Tablosu
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">En İyi Öğrenciler</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Bu haftanın en başarılı siber güvenlik öğrencileri</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center pt-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center mb-2 ring-4 ring-gray-400/30">
                <span className="text-cyber-dark font-bold text-xl">2</span>
              </div>
              <p className="text-sm font-semibold text-foreground text-center">{topStudents[1].name}</p>
              <p className="text-xs text-muted-foreground">{topStudents[1].points} XP</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mb-2 ring-4 ring-yellow-400/30 animate-pulse-glow">
                <Trophy className="w-8 h-8 text-cyber-dark" />
              </div>
              <p className="text-sm font-bold text-yellow-400 text-center">{topStudents[0].name}</p>
              <p className="text-xs text-muted-foreground">{topStudents[0].points} XP</p>
            </div>

            <div className="flex flex-col items-center pt-12">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mb-2 ring-4 ring-orange-400/30">
                <span className="text-cyber-dark font-bold text-lg">3</span>
              </div>
              <p className="text-sm font-semibold text-foreground text-center">{topStudents[2].name}</p>
              <p className="text-xs text-muted-foreground">{topStudents[2].points} XP</p>
            </div>
          </div>

          <div className="glass-effect rounded-2xl overflow-hidden border border-cyber-blue/20">
            <div className="grid grid-cols-12 gap-4 p-4 bg-cyber-dark/50 text-xs font-semibold text-muted-foreground border-b border-border/50">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Öğrenci</div>
              <div className="col-span-3">Okul</div>
              <div className="col-span-2 text-right">XP</div>
              <div className="col-span-2 text-right">Seri</div>
            </div>

            {topStudents.map((student, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-cyber-blue/5 ${
                  index !== topStudents.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <div className="col-span-1">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getRankColor(student.rank)} flex items-center justify-center`}
                  >
                    {student.rank <= 3 ? (
                      getRankIcon(student.rank)
                    ) : (
                      <span className="text-xs font-bold text-cyber-dark">{student.rank}</span>
                    )}
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="font-semibold text-foreground text-sm">{student.name}</p>
                  <p className="text-xs text-cyber-purple">{student.badges} rozet</p>
                </div>
                <div className="col-span-3 text-sm text-muted-foreground truncate">{student.school}</div>
                <div className="col-span-2 text-right">
                  <span className="text-cyber-blue font-bold text-sm">{student.points}</span>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">{student.streak} gün</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="text-cyber-blue hover:text-cyber-purple transition-colors text-sm font-medium inline-flex items-center gap-2">
              Tüm sıralamayı gör
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
