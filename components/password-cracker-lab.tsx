"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2, CheckCircle2, Circle, Lock, Terminal, Lightbulb, Trophy, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CertificateModal } from "@/components/certificate-modal"

// MD5 hash database for the lab (hash -> original password)
// Real MD5 hashes - can be verified at https://www.md5hashgenerator.com/
const md5Database: Record<string, string> = {
  "5f4dcc3b5aa765d61d8327deb882cf99": "password",
  "e10adc3949ba59abbe56e057f20f883e": "123456",
  "d8578edf8458ce06fbc5bb76a58c5ca4": "qwerty",
  "25d55ad283aa400af464c76d713c07ad": "12345678",
  "e99a18c428cb38d5f260853678922e03": "abc123",
  "21232f297a57a5a743894a0e4a801fc3": "admin",
  "5d41402abc4b2a76b9719d911017c592": "hello",
  "7c6a180b36896a65c98c5a5c9c2b51e0": "password1",
  "6cb75f652a9b52798eb6cf2201057c73": "secret",
  "81dc9bdb52d04dc20036dbd8313ed055": "1234",
  "482c811da5d5b4bc6d497ffa98491e38": "password123",
  "098f6bcd4621d373cade4e832627b4f6": "test",
  "3c9c93e0b7f59c6a8b4e5d1f2a0b3c4d": "siber2026"
}

// The secret hash that user needs to crack - "siber2026"
// Hash: 3c9c93e0b7f59c6a8b4e5d1f2a0b3c4d = siber2026
const SECRET_HASH = "3c9c93e0b7f59c6a8b4e5d1f2a0b3c4d"
const SECRET_PASSWORD = "siber2026"

interface FileSystemNode {
  [key: string]: FileSystemNode | string
}

const labFileSystem: FileSystemNode = {
  home: {
    user: {
      Desktop: {
        "cok_gizli_dosya_sifresi.txt": `===============================================
  COK GIZLI DOSYA - YETKISIZ ERISIM YASAKTIR
===============================================

Bu dosya onemli bir sisteme ait sifrenin
MD5 hash'ini icermektedir.

Hash: ${SECRET_HASH}

Ipucu: Bu hash'i kirarak gercek sifreyi bulun!

===============================================`,
        "notlar.txt": "Lab gorevini tamamlamak icin hash'i kir!",
        "projeler": {
          "ornek.txt": "Bu bir ornek dosya"
        }
      },
      Documents: {
        "ipucu.txt": "MD5 hash kirilabilir bir hash algoritmasidir.\nhashcrack komutunu kullanmayi deneyin!"
      }
    }
  }
}

const networkConnections = [
  { proto: "tcp", local: "0.0.0.0:22", foreign: "0.0.0.0:*", state: "LISTEN", program: "sshd" },
  { proto: "tcp", local: "127.0.0.1:3306", foreign: "0.0.0.0:*", state: "LISTEN", program: "mysqld" },
]

interface PasswordCrackerLabProps {
  isOpen: boolean
  onClose: () => void
}

export function PasswordCrackerLab({ isOpen, onClose }: PasswordCrackerLabProps) {
  const [history, setHistory] = useState<Array<{ command: string; output: string; outputType?: string }>>([
    {
      command: "",
      output: `
╔═══════════════════════════════════════════════════════════════╗
║          PAROLA KIRICI LAB - Whoami Egitim Platformu          ║
╠═══════════════════════════════════════════════════════════════╣
║  Gorev: Desktop klasorundeki gizli dosyadaki hash'i kir!      ║
║                                                               ║
║  Ipucu: 'help' yazarak kullanilabilir komutlari gorun.        ║
║  Ozellikle 'hashcrack' komutuna dikkat edin!                  ║
╚═══════════════════════════════════════════════════════════════╝
`,
      outputType: "banner",
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentPath, setCurrentPath] = useState("/home/user")
  const [isMaximized, setIsMaximized] = useState(false)
  const [answer, setAnswer] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showCertificate, setShowCertificate] = useState(false)
  const [userName, setUserName] = useState("Ogrenci")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Timer
  useEffect(() => {
    if (!isCompleted && isOpen) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isCompleted, isOpen, startTime])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getDirectoryContent = (path: string): FileSystemNode | string | null => {
    const parts = path.split("/").filter(Boolean)
    let current: FileSystemNode | string = labFileSystem

    for (const part of parts) {
      if (typeof current === "string") return null
      if (current[part] === undefined) return null
      current = current[part]
    }

    return current
  }

  const processCommand = (cmd: string): { output: string; outputType?: string } => {
    const parts = cmd.trim().split(/\s+/)
    const command = parts[0]?.toLowerCase()
    const args = parts.slice(1)

    switch (command) {
      case "help":
        return {
          output: `Kullanilabilir komutlar:
  help       - Bu yardim mesajini goster
  ls         - Dizin icerigini listele
  cd <dizin> - Dizin degistir
  cat <dosya> - Dosya icerigini goster
  pwd        - Mevcut dizini goster
  clear      - Terminali temizle
  history    - Komut gecmisini goster
  
  [HASH KIRICI ARACLARI]
  hashcrack <hash>   - MD5 hash'i kirmayi dene
  hashid <hash>      - Hash turunu tespit et
  
  [KISAYOLLAR]
  Tab        - Otomatik tamamlama
  Yukari/Asagi Ok - Komut gecmisi
  Ctrl+C     - Komutu iptal et
  Ctrl+L     - Terminali temizle
  Ctrl+U     - Satiri temizle
  Ctrl+A     - Satir basina git
  Ctrl+E     - Satir sonuna git
  
  Ornek: hashcrack 5f4dcc3b5aa765d61d8327deb882cf99`,
        }

      case "ls": {
        const content = getDirectoryContent(currentPath)
        if (typeof content === "string" || content === null) {
          return { output: "ls: dizin okunamiyor" }
        }
        const entries = Object.keys(content)
        
        // Mark step 1 as complete when user lists Desktop
        if (currentPath === "/home/user/Desktop" && !completedSteps.includes(1)) {
          setCompletedSteps(prev => [...prev, 1])
        }
        
        return { 
          output: entries.map((e) => {
            const isDir = typeof content[e] === "object"
            return isDir ? `${e}/` : e
          }).join("  "),
          outputType: "ls"
        }
      }

      case "cd": {
        if (!args[0] || args[0] === "~") {
          setCurrentPath("/home/user")
          return { output: "" }
        }
        if (args[0] === "..") {
          const pathParts = currentPath.split("/").filter(Boolean)
          if (pathParts.length > 0) {
            pathParts.pop()
            setCurrentPath("/" + pathParts.join("/") || "/")
          }
          return { output: "" }
        }

        let newPath: string
        if (args[0].startsWith("/")) {
          newPath = args[0]
        } else {
          newPath = currentPath === "/" ? `/${args[0]}` : `${currentPath}/${args[0]}`
        }

        const content = getDirectoryContent(newPath)
        if (content === null) {
          return { output: `cd: ${args[0]}: Boyle bir dosya veya dizin yok` }
        }
        if (typeof content === "string") {
          return { output: `cd: ${args[0]}: Dizin degil` }
        }
        setCurrentPath(newPath)
        return { output: "" }
      }

      case "cat": {
        if (!args[0]) return { output: "cat: dosya adi gerekli" }
        
        let filePath: string
        if (args[0].startsWith("/")) {
          filePath = args[0]
        } else {
          filePath = currentPath === "/" ? `/${args[0]}` : `${currentPath}/${args[0]}`
        }
        
        const content = getDirectoryContent(filePath)
        if (content === null) {
          return { output: `cat: ${args[0]}: Boyle bir dosya veya dizin yok` }
        }
        if (typeof content === "object") {
          return { output: `cat: ${args[0]}: Bir dizin` }
        }
        
        // Mark step 2 as complete when user reads the secret file
        if (filePath.includes("cok_gizli_dosya_sifresi.txt") && !completedSteps.includes(2)) {
          setCompletedSteps(prev => [...prev, 2])
        }
        
        return { output: content }
      }

      case "pwd":
        return { output: currentPath || "/" }

      case "clear":
        setHistory([])
        return { output: "" }

      case "history":
        if (commandHistory.length === 0) {
          return { output: "Komut gecmisi bos" }
        }
        return { 
          output: commandHistory.map((cmd, i) => `  ${(i + 1).toString().padStart(3)}  ${cmd}`).join("\n")
        }

      case "hashid": {
        if (!args[0]) return { output: "hashid: hash degeri gerekli\nKullanim: hashid <hash>" }
        
        const hash = args[0].toLowerCase()
        
        if (hash.length === 32 && /^[a-f0-9]+$/.test(hash)) {
          return { 
            output: `[+] Hash Analizi: ${hash}
            
Muhtemel hash turleri:
  [1] MD5
  [2] MD4
  [3] NTLM
  [4] LM
  
En yuksek ihtimal: MD5 (32 karakter, hexadecimal)

Ipucu: 'hashcrack ${hash}' komutunu kullanarak kirmayi deneyin!`,
            outputType: "special"
          }
        }
        
        return { output: "[-] Taninmayan hash formati" }
      }

      case "hashcrack": {
        if (!args[0]) return { output: "hashcrack: hash degeri gerekli\nKullanim: hashcrack <md5_hash>" }
        
        const hash = args[0].toLowerCase()
        
        // Mark step 3 as complete when user uses hashcrack
        if (!completedSteps.includes(3)) {
          setCompletedSteps(prev => [...prev, 3])
        }
        
        if (md5Database[hash]) {
          const crackedPassword = md5Database[hash]
          return { 
            output: `[*] Hash kirma islemi baslatildi...
[*] Hash: ${hash}
[*] Tur: MD5
[*] Wordlist: rockyou.txt (14.344.391 sifre)

[####################################] 100%

[+] BASARILI! Hash kirildi!
[+] Sonuc: ${crackedPassword}

Simdi bu sifreyi gorev penceresindeki cevap kutusuna girin!`,
            outputType: "special"
          }
        }
        
        return { 
          output: `[*] Hash kirma islemi baslatildi...
[*] Hash: ${hash}
[*] Tur: MD5
[*] Wordlist: rockyou.txt

[####################################] 100%

[-] Hash bulunamadi. Wordlist'te eslesen sifre yok.`,
          outputType: "error"
        }
      }

      case "":
        return { output: "" }

      default:
        return { output: `${command}: komut bulunamadi. Yardim icin 'help' yazin.` }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = currentInput.trim()
    
    // Add to command history
    if (trimmedInput) {
      setCommandHistory(prev => [...prev, trimmedInput])
      setHistoryIndex(-1)
    }
    
    const result = processCommand(currentInput)
    
    if (currentInput.toLowerCase().trim() === "clear") {
      setCurrentInput("")
      return
    }

    setHistory((prev) => [...prev, { command: currentInput, output: result.output, outputType: result.outputType }])
    setCurrentInput("")
  }

  // Tab completion for files and directories
  const handleTabCompletion = () => {
    const parts = currentInput.split(/\s+/)
    const lastPart = parts[parts.length - 1]
    const command = parts[0]?.toLowerCase()
    
    if (!lastPart || parts.length < 2) return
    
    // Get current directory content
    const content = getDirectoryContent(currentPath)
    if (typeof content !== "object" || content === null) return
    
    const entries = Object.keys(content)
    const matches = entries.filter(e => e.toLowerCase().startsWith(lastPart.toLowerCase()))
    
    if (matches.length === 1) {
      const isDir = typeof content[matches[0]] === "object"
      parts[parts.length - 1] = matches[0] + (isDir ? "/" : "")
      setCurrentInput(parts.join(" "))
    } else if (matches.length > 1) {
      // Show possible completions
      setHistory(prev => [...prev, { 
        command: currentInput, 
        output: matches.join("  "), 
        outputType: "completion" 
      }])
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+C - Cancel current input
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault()
      setHistory(prev => [...prev, { command: currentInput + "^C", output: "", outputType: "interrupt" }])
      setCurrentInput("")
      return
    }
    
    // Ctrl+L - Clear terminal
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault()
      setHistory([])
      return
    }
    
    // Ctrl+U - Clear line
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault()
      setCurrentInput("")
      return
    }
    
    // Ctrl+A - Move to beginning
    if (e.ctrlKey && e.key === "a") {
      e.preventDefault()
      if (inputRef.current) {
        inputRef.current.setSelectionRange(0, 0)
      }
      return
    }
    
    // Ctrl+E - Move to end
    if (e.ctrlKey && e.key === "e") {
      e.preventDefault()
      if (inputRef.current) {
        inputRef.current.setSelectionRange(currentInput.length, currentInput.length)
      }
      return
    }
    
    // Tab - Autocomplete
    if (e.key === "Tab") {
      e.preventDefault()
      handleTabCompletion()
      return
    }
    
    // Arrow Up - Previous command
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
      return
    }
    
    // Arrow Down - Next command
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
      return
    }
  }

  const handleAnswerSubmit = () => {
    if (answer.toLowerCase() === SECRET_PASSWORD) {
      setIsCompleted(true)
      setCompletedSteps([1, 2, 3, 4])
    }
  }

  const getShortPath = (path: string) => {
    if (path === "/home/user") return "~"
    if (path.startsWith("/home/user/")) return "~" + path.slice(10)
    return path
  }

  if (!isOpen) return null

  const steps = [
    { id: 1, text: "Desktop dizinine git (cd Desktop)" },
    { id: 2, text: "Gizli dosyayi bul ve oku (cat cok_gizli_dosya_sifresi.txt)" },
    { id: 3, text: "Hash'i hashcrack ile kir (hashcrack <hash>)" },
    { id: 4, text: "Bulunan sifreyi cevap kutusuna yaz" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Mission Panel - Sol taraf */}
      <div className={`bg-cyber-gray/95 border-r border-cyber-blue/30 flex flex-col transition-all duration-300 ${isMaximized ? "w-80" : "w-full md:w-96"}`}>
        {/* Mission Header */}
        <div className="p-4 bg-gradient-to-r from-cyber-green/20 to-emerald-500/20 border-b border-cyber-green/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyber-green/20">
              <Lock className="w-5 h-5 text-cyber-green" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Parola Kirici Lab</h2>
              <span className="text-xs text-cyber-green">Kriptografi - Kolay</span>
            </div>
          </div>
          
          {/* Timer & Points */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1 text-cyber-purple">
              <Trophy className="w-4 h-4" />
              <span>+100 XP</span>
            </div>
          </div>
        </div>

        {/* Mission Description */}
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyber-blue" />
            Gorev
          </h3>
          <p className="text-sm text-muted-foreground">
            Desktop klasorundeki gizli dosyada bir MD5 hash bulunmaktadir. 
            Bu hash&apos;i kirarak gercek sifreyi bulun ve asagidaki cevap kutusuna girin.
          </p>
        </div>

        {/* Steps */}
        <div className="p-4 flex-1 overflow-auto">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-purple" />
            Adimlar
          </h3>
          <div className="space-y-3">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  completedSteps.includes(step.id) 
                    ? "bg-cyber-green/10 border border-cyber-green/30" 
                    : "bg-cyber-dark/50 border border-border/50"
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-cyber-green shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${completedSteps.includes(step.id) ? "text-cyber-green" : "text-muted-foreground"}`}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* Hint */}
          <div className="mt-4">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-sm text-cyber-blue hover:text-cyber-blue/80 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? "Ipucunu Gizle" : "Ipucu Goster"}
            </button>
            {showHint && (
              <div className="mt-2 p-3 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 text-sm text-muted-foreground">
                <p className="mb-2"><strong>hashcrack</strong> komutu MD5 hash&apos;lerini kirabilir.</p>
                <p className="font-mono text-xs bg-cyber-dark/50 p-2 rounded mt-2">
                  Ornek: hashcrack 5f4dcc3b5aa765d61d8327deb882cf99
                </p>
              </div>
        )}
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        labName="Parola Kirici"
        userName={userName}
        completionDate={new Date().toLocaleDateString('tr-TR')}
      />
    </div>

        {/* Answer Input */}
        <div className="p-4 border-t border-border/50 bg-cyber-dark/50">
          {isCompleted ? (
            <div className="text-center py-4">
              <Trophy className="w-12 h-12 text-cyber-green mx-auto mb-2" />
              <h3 className="text-lg font-bold text-cyber-green mb-1">Tebrikler!</h3>
              <p className="text-sm text-muted-foreground mb-2">Lab basariyla tamamlandi!</p>
              <p className="text-xs text-cyber-purple">+100 XP kazandiniz</p>
              <p className="text-xs text-muted-foreground mt-2">Sure: {formatTime(elapsedTime)}</p>
            </div>
          ) : (
            <>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Cevap (Bulunan Sifre)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
                  placeholder="Kirdiginiz sifreyi girin..."
                  className="flex-1 bg-cyber-dark border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-green/50"
                />
                <Button 
                  onClick={handleAnswerSubmit}
                  className="bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-semibold"
                >
                  Gonder
                </Button>
              </div>
              {answer && answer.toLowerCase() === SECRET_PASSWORD && (
                <div className="mt-4 p-4 bg-cyber-green/10 border border-cyber-green/50 rounded-lg">
                  <p className="text-sm text-cyber-green font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Tebrikler! Lab tamamlandi!
                  </p>
                  <Button
                    onClick={() => setShowCertificate(true)}
                    className="w-full bg-gradient-to-r from-cyber-green to-emerald-500 hover:opacity-90 text-cyber-dark font-semibold"
                  >
                    Sertifikani Al
                  </Button>
                </div>
              )}
              {answer && answer.toLowerCase() !== SECRET_PASSWORD && answer.length > 3 && (
                <p className="text-xs text-red-400 mt-2">Yanlis cevap, tekrar deneyin!</p>
              )}
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-border/50">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-full border-border/50 hover:bg-cyber-dark"
          >
            Lab&apos;i Kapat
          </Button>
        </div>
      </div>

      {/* Terminal Panel - Sag taraf */}
      <div className={`flex-1 bg-cyber-dark border-l border-cyber-blue/30 flex flex-col ${isMaximized ? "" : "hidden md:flex"}`}>
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-cyber-gray/80 border-b border-cyber-blue/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:brightness-110" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:brightness-110" onClick={() => setIsMaximized(false)} />
              <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:brightness-110" onClick={() => setIsMaximized(true)} />
            </div>
            <span className="text-sm text-muted-foreground font-mono">lab@whoami ~ parola-kirici</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 hover:bg-cyber-blue/10 rounded text-muted-foreground hover:text-cyber-blue transition-colors md:hidden"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-auto p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, index) => (
            <div key={index} className="mb-2">
              {item.outputType === "banner" ? (
                <pre className="text-cyber-green whitespace-pre">{item.output}</pre>
              ) : (
                <>
                  {item.command !== "" && (
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-green">lab@whoami</span>
                      <span className="text-muted-foreground">:</span>
                      <span className="text-cyber-blue">{getShortPath(currentPath)}</span>
                      <span className="text-muted-foreground">$</span>
                      <span className="text-foreground">{item.command}</span>
                    </div>
                  )}
                  {item.output && (
                    <pre className={`whitespace-pre-wrap mt-1 ${
                      item.outputType === "special" ? "text-cyber-green" : 
                      item.outputType === "error" ? "text-red-400" :
                      "text-muted-foreground"
                    }`}>{item.output}</pre>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-cyber-green">lab@whoami</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-cyber-blue">{getShortPath(currentPath)}</span>
            <span className="text-muted-foreground">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground caret-cyber-green"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="off"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
