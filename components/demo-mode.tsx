"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Terminal, Zap, ChevronRight, X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DemoStep {
  command: string
  output: string
  delay: number
  description: string
}

const demoScenario: DemoStep[] = [
  {
    command: "whoami",
    output: "Gelecegin Siber Guvenlik Uzmani",
    delay: 3000,
    description: "Kim oldugunu ogren"
  },
  {
    command: "ls -la",
    output: `toplam 16
drwxr-xr-x  1 user user  4096 Mar 25 10:00 Desktop/
drwxr-xr-x  1 user user  4096 Mar 25 10:00 Documents/
drwxr-xr-x  1 user user  4096 Mar 25 10:00 Downloads/
drwx------  1 user user  4096 Mar 25 10:00 .ssh/
-rw-r--r--  1 user user  1024 Mar 25 10:00 .bashrc`,
    delay: 4000,
    description: "Dizin icerigini listele"
  },
  {
    command: "cd Desktop",
    output: "",
    delay: 2000,
    description: "Desktop dizinine gec"
  },
  {
    command: "ls",
    output: "flag.txt  notlar.txt  projeler/",
    delay: 3000,
    description: "Desktop icerigini gor"
  },
  {
    command: "cat flag.txt",
    output: "FLAG{welcome_to_whoami_platform_2026}",
    delay: 4000,
    description: "Gizli flag dosyasini oku"
  },
  {
    command: "netstat",
    output: `Aktif Internet baglantilari:
Proto  Local Address          Foreign Address        State       Program
---------------------------------------------------------------------------
tcp    0.0.0.0:22             0.0.0.0:*              LISTEN      sshd
tcp    127.0.0.1:3306         0.0.0.0:*              LISTEN      mysqld
tcp    192.168.1.100:22       192.168.1.105:54321    ESTABLISHED sshd
tcp    192.168.1.100:443      142.250.187.46:443     ESTABLISHED firefox`,
    delay: 5000,
    description: "Ag baglantilarini incele"
  },
  {
    command: "ask SQL injection nedir?",
    output: `[CyberMentor] SQL Injection, web uygulamalarinda kullanici girdilerinin 
dogrudan SQL sorgularina eklenmesiyle ortaya cikan bir guvenlik acigi. 
Saldirganlar bu acik sayesinde veritabanina yetkisiz erisim saglayabilir, 
veri cabilir veya sisteme zarar verebilir. Onlem olarak parametreli 
sorgular ve giris dogrulama kullanilmali.`,
    delay: 6000,
    description: "AI Mentor'a soru sor"
  },
  {
    command: "cd /var/log",
    output: "",
    delay: 2000,
    description: "Log dizinine gec"
  },
  {
    command: "cat auth.log",
    output: `Mar 25 10:15:23 sshd: Failed password for root from 192.168.1.105
Mar 25 10:15:45 sshd: Accepted password for user`,
    delay: 4000,
    description: "Kimlik dogrulama loglarini incele"
  },
  {
    command: "echo 'Demo tamamlandi! Whoami platformuna hosgeldiniz.'",
    output: "Demo tamamlandi! Whoami platformuna hosgeldiniz.",
    delay: 4000,
    description: "Demo bitis mesaji"
  }
]

interface DemoModeProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoMode({ isOpen, onClose }: DemoModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [typedCommand, setTypedCommand] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentPath, setCurrentPath] = useState("/home/user")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Keyboard sound effect (simulated with beep)
  const playKeySound = () => {
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.value = 800 + Math.random() * 200
        oscillator.type = "square"
        gainNode.gain.value = 0.02
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.03)
      } catch {
        // Audio not available
      }
    }
  }

  // Type command character by character
  const typeCommand = (command: string, index: number = 0) => {
    if (index < command.length) {
      setTypedCommand(command.slice(0, index + 1))
      playKeySound()
      typeTimeoutRef.current = setTimeout(() => typeCommand(command, index + 1), 80 + Math.random() * 70)
    } else {
      // Command fully typed, show output after a brief pause
      setTimeout(() => {
        setShowOutput(true)
        
        // Update path if cd command
        if (command.startsWith("cd ")) {
          const target = command.replace("cd ", "")
          if (target === "Desktop") {
            setCurrentPath("/home/user/Desktop")
          } else if (target === "/var/log") {
            setCurrentPath("/var/log")
          } else if (target === "..") {
            setCurrentPath("/home/user")
          }
        }
        
        // Move to next step after delay
        stepTimeoutRef.current = setTimeout(() => {
          setCompletedSteps(prev => [...prev, currentStep])
          if (currentStep < demoScenario.length - 1) {
            setCurrentStep(prev => prev + 1)
            setTypedCommand("")
            setShowOutput(false)
          } else {
            setIsPlaying(false)
          }
        }, demoScenario[currentStep].delay)
      }, 300)
    }
  }

  // Start/resume demo
  useEffect(() => {
    if (isPlaying && currentStep < demoScenario.length) {
      const step = demoScenario[currentStep]
      typeCommand(step.command)
    }
    
    return () => {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current)
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
    }
  }, [isPlaying, currentStep])

  // Auto scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [typedCommand, showOutput, completedSteps])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setTypedCommand("")
    setShowOutput(false)
    setCompletedSteps([])
    setCurrentPath("/home/user")
    if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current)
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
  }

  const getShortPath = (path: string) => {
    if (path === "/home/user") return "~"
    if (path.startsWith("/home/user/")) return "~" + path.slice(10)
    return path
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-cyber-dark border border-cyber-blue/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,212,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyber-gray to-cyber-dark border-b border-cyber-blue/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyber-blue animate-pulse" />
              <span className="text-lg font-bold text-foreground">Sunum Modu</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Adim {currentStep + 1} / {demoScenario.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-muted-foreground hover:text-foreground"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Terminal */}
          <div className="flex-1 lg:border-r border-cyber-blue/20">
            <div className="bg-cyber-gray/50 px-4 py-2 border-b border-cyber-blue/20 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground font-mono ml-2">demo@whoami ~ terminal</span>
            </div>
            
            <div ref={terminalRef} className="h-[400px] overflow-auto p-4 font-mono text-sm">
              {/* Banner */}
              <pre className="text-cyber-green mb-4">{`
██╗    ██╗██╗  ██╗ ██████╗  █████╗ ███╗   ███╗██╗
██║    ██║██║  ██║██╔═══██╗██╔══██╗████╗ ████║██║
██║ █╗ ██║███████║██║   ██║███████║██╔████╔██║██║
██║███╗██║██╔══██║██║   ██║██╔══██║██║╚██╔╝██║██║
╚███╔███╔╝██║  ██║╚██████╔╝██║  ██║██║ ╚═╝ ██║██║
 ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
    
    Whoami Demo - Siber Guvenlik Egitim Platformu
`}</pre>

              {/* Completed steps */}
              {completedSteps.map((stepIdx) => {
                const step = demoScenario[stepIdx]
                const stepPath = stepIdx === 0 ? "/home/user" : 
                  stepIdx > 2 ? (stepIdx > 7 ? "/var/log" : "/home/user/Desktop") : "/home/user"
                return (
                  <div key={stepIdx} className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-green">demo@whoami</span>
                      <span className="text-muted-foreground">:</span>
                      <span className="text-cyber-blue">{getShortPath(stepPath)}</span>
                      <span className="text-muted-foreground">$</span>
                      <span className="text-foreground">{step.command}</span>
                    </div>
                    {step.output && (
                      <pre className={`whitespace-pre-wrap mt-1 ${
                        step.command.startsWith("ask") ? "text-cyber-green" : "text-muted-foreground"
                      }`}>{step.output}</pre>
                    )}
                  </div>
                )
              })}

              {/* Current step */}
              {currentStep < demoScenario.length && (
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-green">demo@whoami</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-cyber-blue">{getShortPath(currentPath)}</span>
                    <span className="text-muted-foreground">$</span>
                    <span className="text-foreground">{typedCommand}</span>
                    {isPlaying && !showOutput && (
                      <span className="w-2 h-5 bg-cyber-blue animate-pulse" />
                    )}
                  </div>
                  {showOutput && demoScenario[currentStep].output && (
                    <pre className={`whitespace-pre-wrap mt-1 animate-in fade-in duration-300 ${
                      demoScenario[currentStep].command.startsWith("ask") ? "text-cyber-green" : "text-muted-foreground"
                    }`}>{demoScenario[currentStep].output}</pre>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Step info */}
          <div className="lg:w-80 bg-cyber-gray/30 p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Demo Adimlari
            </h3>
            <div className="space-y-2 max-h-[350px] overflow-auto">
              {demoScenario.map((step, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border transition-all ${
                    idx === currentStep 
                      ? "border-cyber-blue bg-cyber-blue/10" 
                      : completedSteps.includes(idx)
                        ? "border-cyber-green/30 bg-cyber-green/5"
                        : "border-border bg-cyber-dark/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      completedSteps.includes(idx) 
                        ? "bg-cyber-green text-cyber-dark"
                        : idx === currentStep
                          ? "bg-cyber-blue text-cyber-dark"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {completedSteps.includes(idx) ? "✓" : idx + 1}
                    </span>
                    <span className={`text-sm font-medium ${
                      idx === currentStep ? "text-cyber-blue" : "text-foreground"
                    }`}>
                      {step.description}
                    </span>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono">
                    $ {step.command}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-cyber-gray/50 border-t border-cyber-blue/20">
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePlayPause}
              className={`gap-2 ${
                isPlaying 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                  : "bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-white"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Duraklat
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {currentStep === 0 && completedSteps.length === 0 ? "Demoyu Baslat" : "Devam Et"}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Sifirla
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Terminal className="w-4 h-4" />
            <span>Juri sunumu icin optimize edilmistir</span>
          </div>
        </div>
      </div>
    </div>
  )
}
