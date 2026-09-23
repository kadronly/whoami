"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, Eye, Flag, Lock, RotateCcw, Terminal, Trophy, XCircle, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Difficulty = "Kolay" | "Orta" | "Zor" | "Uzman"
type Challenge = { id: string; title: string; description: string; hint: string; difficulty: Difficulty; points: number; category: string; sort_order: number }
type Submission = { challenge_id: string; points: number }

const difficultyColors: Record<Difficulty, string> = {
  Kolay: "text-cyber-green border-cyber-green/30 bg-cyber-green/10",
  Orta: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Zor: "text-cyber-pink border-cyber-pink/30 bg-cyber-pink/10",
  Uzman: "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10",
}

export function CTFChallenge() {
  const supabase = useMemo(() => createClient(), [])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activeId, setActiveId] = useState("")
  const [userInput, setUserInput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" })
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const [{ data: labs }, { data: { user } }] = await Promise.all([
        supabase.from("ctf_challenges").select("id,title,description,hint,difficulty,points,category,sort_order").eq("is_active", true).order("sort_order"),
        supabase.auth.getUser(),
      ])
      if (!mounted) return
      const next = (labs ?? []) as Challenge[]
      setChallenges(next)
      if (next[0]) setActiveId(next[0].id)
      if (user) {
        const { data } = await supabase.from("ctf_submissions").select("challenge_id,points").eq("user_id", user.id)
        if (mounted) setSubmissions((data ?? []) as Submission[])
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  useEffect(() => {
    if (!isRunning) return
    const timer = window.setInterval(() => setTimeElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isRunning])

  const activeChallenge = challenges.find((challenge) => challenge.id === activeId) ?? challenges[0]
  const solvedIds = new Set(submissions.map((submission) => submission.challenge_id))
  const totalScore = submissions.reduce((sum, submission) => sum + submission.points, 0)
  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`

  const start = () => { setIsRunning(true); inputRef.current?.focus() }
  const submit = async () => {
    if (!activeChallenge) return
    if (!isRunning) { start(); return }
    const { data, error } = await supabase.rpc("submit_ctf_flag", { p_challenge_id: activeChallenge.id, p_flag: userInput, p_elapsed_seconds: timeElapsed })
    if (error) { setFeedback({ type: "error", message: "Gönderim sırasında bir hata oluştu." }); return }
    if (data?.ok) {
      setSubmissions((current) => [...current, { challenge_id: activeChallenge.id, points: data.points }])
      setFeedback({ type: "success", message: `Doğru flag. ${data.points} puan profilinize işlendi.` })
      setUserInput("")
      const next = challenges.find((challenge) => !solvedIds.has(challenge.id) && challenge.id !== activeChallenge.id)
      if (next) window.setTimeout(() => { setActiveId(next.id); setFeedback({ type: null, message: "" }); setShowHint(false) }, 1100)
    } else {
      const messages: Record<string, string> = { AUTH_REQUIRED: "Puan kazanmak için giriş yapmalısın.", ALREADY_SOLVED: "Bu lab daha önce tamamlandı.", WRONG_FLAG: "Yanlış flag. Tekrar dene.", NOT_FOUND: "Lab bulunamadı." }
      setFeedback({ type: "error", message: messages[data?.code] ?? "Flag kabul edilmedi." })
    }
  }

  const reset = () => { setTimeElapsed(0); setIsRunning(false); setUserInput(""); setFeedback({ type: null, message: "" }); setShowHint(false); setActiveId(challenges[0]?.id ?? "") }

  return (
    <section className="py-20 relative overflow-hidden" id="ctf-challenge">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/5 via-transparent to-cyber-blue/5 pointer-events-none" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-pink/10 border border-cyber-pink/20 mb-4"><Flag className="size-4 text-cyber-pink" /><span className="text-sm text-cyber-pink font-medium">CTF Yarışma Alanı</span></div><h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Mini <span className="text-gradient">CTF Challenge</span></h2><p className="text-muted-foreground max-w-2xl mx-auto">Labları kolaydan uzmana çöz, puanları anında profilinde gör.</p></div>
        {loading ? <div className="glass-effect rounded-2xl p-12 text-center text-muted-foreground">Lablar yükleniyor...</div> : !activeChallenge ? <div className="glass-effect rounded-2xl p-12 text-center">Henüz aktif lab yok.</div> : <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1 flex flex-col gap-4"><div className="glass-effect rounded-xl p-4"><div className="flex items-center justify-between mb-3"><span className="flex items-center gap-2"><Trophy className="size-5 text-yellow-400" /><strong>{totalScore}</strong> puan</span><span className="flex items-center gap-2 font-mono"><Clock className="size-4 text-cyber-blue" />{formatTime(timeElapsed)}</span></div><p className="text-sm text-muted-foreground"><CheckCircle2 className="size-4 inline text-cyber-green mr-1" />{solvedIds.size}/{challenges.length} lab tamamlandı</p></div>{challenges.map((challenge) => <button key={challenge.id} onClick={() => { setActiveId(challenge.id); setUserInput(""); setFeedback({ type: null, message: "" }); setShowHint(false) }} className={`w-full text-left p-4 rounded-xl border transition-colors ${activeId === challenge.id ? "border-cyber-blue bg-cyber-blue/10" : solvedIds.has(challenge.id) ? "border-cyber-green/30 bg-cyber-green/5" : "border-border bg-cyber-dark/50 hover:border-cyber-blue/50"}`}><div className="flex items-start justify-between gap-2 mb-2"><span className="flex items-center gap-2 font-semibold">{solvedIds.has(challenge.id) ? <CheckCircle2 className="size-5 text-cyber-green" /> : <Lock className="size-5 text-muted-foreground" />}{challenge.title}</span><span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>{challenge.difficulty}</span></div><p className="text-sm text-muted-foreground mb-2">{challenge.description}</p><div className="flex justify-between text-xs"><span className="text-cyber-purple">{challenge.category}</span><span className="text-cyber-blue font-mono">{challenge.points} puan</span></div></button>)}</div>
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6 md:p-8"><div className="flex items-start justify-between mb-6"><div><div className="flex items-center gap-2 mb-2"><Terminal className="size-5 text-cyber-blue" /><h3 className="text-xl font-bold">{activeChallenge.title}</h3></div><p className="text-muted-foreground">{activeChallenge.description}</p></div><div className="text-right"><div className="text-2xl font-bold text-cyber-blue">{activeChallenge.points}</div><div className="text-xs text-muted-foreground">puan</div></div></div><div className="bg-cyber-dark rounded-xl p-4 mb-6"><p className="text-xs text-cyber-purple uppercase tracking-wider mb-2">Lab yönergesi</p><p className="text-sm text-cyber-green">Flag formatı: WHOAMI&#123;...&#125;</p></div><div className="mb-6"><button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-sm text-yellow-400"><AlertTriangle className="size-4" />{showHint ? "İpucunu gizle" : "İpucu göster"}</button>{showHint && <div className="mt-2 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-sm text-yellow-400">{activeChallenge.hint}</div>}</div><div className="flex gap-3"><Input ref={inputRef} value={userInput} onChange={(event) => setUserInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) submit() }} placeholder="WHOAMI{...} formatında flag gir" disabled={solvedIds.has(activeChallenge.id)} className="bg-cyber-dark font-mono" /><Button onClick={submit} disabled={solvedIds.has(activeChallenge.id)} className="bg-gradient-to-r from-cyber-blue to-cyber-purple gap-2">{isRunning ? <>Gönder <ChevronRight className="size-4" /></> : <>Başla <Zap className="size-4" /></>}</Button></div>{feedback.type && <div className={`mt-4 flex items-center gap-2 p-3 rounded-lg ${feedback.type === "success" ? "bg-cyber-green/10 text-cyber-green" : "bg-red-500/10 text-red-400"}`}>{feedback.type === "success" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}{feedback.message}</div>}{solvedIds.size === challenges.length && <div className="mt-8 text-center"><Trophy className="size-16 text-yellow-400 mx-auto mb-3" /><h3 className="text-xl font-bold">Yarışmayı tamamladın</h3><p className="text-muted-foreground mb-4">Toplam {totalScore} puan profil hesabına işlendi.</p><Button onClick={reset} variant="outline" className="gap-2"><RotateCcw className="size-4" />Tekrar incele</Button></div>}</div>
        </div>}
      </div>
    </section>
  )
}
