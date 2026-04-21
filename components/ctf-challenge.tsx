"use client"

import { useState, useEffect, useRef } from "react"
import { Flag, Trophy, Clock, AlertTriangle, CheckCircle2, XCircle, Sparkles, RotateCcw, ChevronRight, Lock, Eye, EyeOff, Terminal, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Challenge {
  id: number
  title: string
  description: string
  hint: string
  flag: string
  difficulty: "Kolay" | "Orta" | "Zor"
  points: number
  category: string
  clue: string
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Tersine Cevir",
    description: "Bu metin tersten yazilmis. Dogru siraya koy!",
    hint: "Metni sondan basa dogru oku.",
    flag: "WHOAMI{tersyazi}",
    difficulty: "Kolay",
    points: 100,
    category: "Basit",
    clue: "}izaysret{IMAOHW"
  },
  {
    id: 2,
    title: "Gizli Mesaj",
    description: "Bu HTML yorumunda bir flag gizli. Dogrudan kopyala!",
    hint: "Asagidaki metni oldugu gibi kopyala ve gonder.",
    flag: "WHOAMI{html_yorum}",
    difficulty: "Kolay",
    points: 100,
    category: "Web",
    clue: "<!-- Cevap: WHOAMI{html_yorum} -->"
  },
  {
    id: 3,
    title: "Sayi Bulmaca",
    description: "Her harf = sira numarasi. A=1, B=2, C=3... W=23, H=8, O=15...",
    hint: "W=23, H=8, O=15, A=1, M=13, I=9. Harfleri yaz: WHOAMI",
    flag: "WHOAMI{231815113}",
    difficulty: "Orta",
    points: 150,
    category: "Kod",
    clue: "23-8-15-1-13-9 = ? (Harflerin sira numaralari)"
  },
  {
    id: 4,
    title: "Emoji Sifresi",
    description: "Her emoji bir harfi temsil ediyor!",
    hint: "Kilit=L, Kalp=O, Anahtar=V, Yildiz=E. Kelimeyi bul ve WHOAMI{kelime} formatinda yaz.",
    flag: "WHOAMI{love}",
    difficulty: "Orta",
    points: 150,
    category: "Eglence",
    clue: "Sifre: L-O-V-E"
  }
]

function ChallengeCard({ 
  challenge, 
  isActive, 
  isSolved, 
  onSelect 
}: { 
  challenge: Challenge
  isActive: boolean
  isSolved: boolean
  onSelect: () => void
}) {
  const difficultyColors = {
    "Kolay": "text-cyber-green border-cyber-green/30 bg-cyber-green/10",
    "Orta": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    "Zor": "text-cyber-pink border-cyber-pink/30 bg-cyber-pink/10"
  }

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
        isActive 
          ? "border-cyber-blue bg-cyber-blue/10 shadow-[0_0_20px_rgba(0,212,255,0.2)]" 
          : isSolved 
            ? "border-cyber-green/30 bg-cyber-green/5"
            : "border-border bg-cyber-dark/50 hover:border-cyber-blue/50"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isSolved ? (
            <CheckCircle2 className="w-5 h-5 text-cyber-green" />
          ) : (
            <Lock className={`w-5 h-5 ${isActive ? "text-cyber-blue" : "text-muted-foreground"}`} />
          )}
          <h4 className="font-semibold text-foreground">{challenge.title}</h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-cyber-purple">{challenge.category}</span>
        <span className="text-xs text-cyber-blue font-mono">{challenge.points} puan</span>
      </div>
    </button>
  )
}

export function CTFChallenge() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(challenges[0])
  const [userInput, setUserInput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [solvedChallenges, setSolvedChallenges] = useState<number[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" })
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsRunning(true)
    setShowClue(true)
    inputRef.current?.focus()
  }

  const handleSubmit = () => {
    if (!isRunning) {
      handleStart()
      return
    }

    const trimmedInput = userInput.trim()
    
    if (trimmedInput === activeChallenge.flag) {
      // Correct answer
      if (!solvedChallenges.includes(activeChallenge.id)) {
        setSolvedChallenges(prev => [...prev, activeChallenge.id])
        setTotalScore(prev => prev + activeChallenge.points)
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2000)
      }
      setFeedback({ type: "success", message: "Tebrikler! Flag dogru!" })
      setUserInput("")
      setShowHint(false)
      setShowClue(false)
      
      // Move to next unsolved challenge
      const nextUnsolved = challenges.find(c => !solvedChallenges.includes(c.id) && c.id !== activeChallenge.id)
      if (nextUnsolved) {
        setTimeout(() => {
          setActiveChallenge(nextUnsolved)
          setFeedback({ type: null, message: "" })
        }, 1500)
      }
    } else {
      // Wrong answer
      setFeedback({ type: "error", message: "Yanlis flag! Tekrar dene." })
      setTimeout(() => setFeedback({ type: null, message: "" }), 2000)
    }
  }

  const handleReset = () => {
    setSolvedChallenges([])
    setTotalScore(0)
    setTimeElapsed(0)
    setIsRunning(false)
    setUserInput("")
    setShowHint(false)
    setShowClue(false)
    setFeedback({ type: null, message: "" })
    setActiveChallenge(challenges[0])
  }

  const allSolved = solvedChallenges.length === challenges.length

  return (
    <section className="py-20 relative overflow-hidden" id="ctf-challenge">
      {/* Confetti effect */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-[fall_2s_ease-in-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              <Sparkles className={`w-4 h-4 ${["text-cyber-blue", "text-cyber-purple", "text-cyber-pink", "text-cyber-green", "text-yellow-400"][Math.floor(Math.random() * 5)]}`} />
            </div>
          ))}
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/5 via-transparent to-cyber-blue/5 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-pink/10 border border-cyber-pink/20 mb-4">
            <Flag className="w-4 h-4 text-cyber-pink" />
            <span className="text-sm text-cyber-pink font-medium">Interaktif Demo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mini <span className="text-gradient">CTF Challenge</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Siber guvenlik becerilerini test et! Asagidaki zorlukları cozerek puan kazan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Challenge list */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-effect rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-foreground">{totalScore}</span>
                  <span className="text-muted-foreground text-sm">puan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyber-blue" />
                  <span className="font-mono text-foreground">{formatTime(timeElapsed)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                <span className="text-muted-foreground">{solvedChallenges.length}/{challenges.length} cozuldu</span>
              </div>
            </div>

            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isActive={activeChallenge.id === challenge.id}
                isSolved={solvedChallenges.includes(challenge.id)}
                onSelect={() => {
                  setActiveChallenge(challenge)
                  setShowHint(false)
                  setShowClue(isRunning)
                  setUserInput("")
                  setFeedback({ type: null, message: "" })
                }}
              />
            ))}
          </div>

          {/* Active challenge */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl p-6 md:p-8 h-full">
              {allSolved ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="relative mb-6">
                    <Trophy className="w-24 h-24 text-yellow-400" />
                    <Sparkles className="w-8 h-8 text-cyber-pink absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Tebrikler!</h3>
                  <p className="text-muted-foreground mb-4">Tum challenge&apos;lari basariyla tamamladin!</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyber-blue">{totalScore}</div>
                      <div className="text-sm text-muted-foreground">Toplam Puan</div>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyber-green">{formatTime(timeElapsed)}</div>
                      <div className="text-sm text-muted-foreground">Sure</div>
                    </div>
                  </div>
                  <Button onClick={handleReset} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Tekrar Oyna
                  </Button>
                </div>
              ) : (
                <>
                  {/* Challenge header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-5 h-5 text-cyber-blue" />
                        <h3 className="text-xl font-bold text-foreground">{activeChallenge.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{activeChallenge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyber-blue">{activeChallenge.points}</div>
                      <div className="text-xs text-muted-foreground">puan</div>
                    </div>
                  </div>

                  {/* Clue area */}
                  <div className="bg-cyber-dark rounded-xl p-4 mb-6 font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-cyber-purple uppercase tracking-wider">Ipucu / Veri</span>
                      {!showClue && !isRunning && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={handleStart}
                          className="text-cyber-blue hover:text-cyber-blue/80 gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Goster
                        </Button>
                      )}
                    </div>
                    <div className={`text-sm break-all ${showClue ? "text-cyber-green" : "text-muted-foreground blur-sm select-none"}`}>
                      {showClue ? activeChallenge.clue : "Baslat butonuna bas ve ipucunu gor..."}
                    </div>
                  </div>

                  {/* Hint section */}
                  {showClue && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {showHint ? "Ipucunu Gizle" : "Ipucu Goster"}
                        {!showHint && <span className="text-xs text-muted-foreground">(-25 puan)</span>}
                      </button>
                      {showHint && (
                        <div className="mt-2 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-sm text-yellow-400">
                          {activeChallenge.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Input area */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder="WHOAMI{...} formatinda flag gir"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                          className="bg-cyber-dark border-border focus:border-cyber-blue font-mono pr-10"
                          disabled={solvedChallenges.includes(activeChallenge.id)}
                        />
                        <Flag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <Button 
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-white gap-2"
                        disabled={solvedChallenges.includes(activeChallenge.id)}
                      >
                        {!isRunning ? (
                          <>
                            <Zap className="w-4 h-4" />
                            Basla
                          </>
                        ) : (
                          <>
                            Gonder
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Feedback */}
                    {feedback.type && (
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        feedback.type === "success" 
                          ? "bg-cyber-green/10 border border-cyber-green/20 text-cyber-green"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}>
                        {feedback.type === "success" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        {feedback.message}
                      </div>
                    )}

                    {solvedChallenges.includes(activeChallenge.id) && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-cyber-green/10 border border-cyber-green/20 text-cyber-green">
                        <CheckCircle2 className="w-5 h-5" />
                        Bu challenge zaten cozuldu!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
