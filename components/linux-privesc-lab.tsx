"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2, CheckCircle2, Circle, Server, Terminal, Lightbulb, Trophy, Clock, Target, Skull } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CertificateModal } from "@/components/certificate-modal"

interface LinuxPrivescLabProps {
  isOpen: boolean
  onClose: () => void
}

const secretFlag = "WHOAMI{r00t_4cc3ss_gr4nt3d}"

const labSteps = [
  { id: 1, title: "Sistemi Kesfet", description: "whoami ve id komutlariyla mevcut kullaniciyi ogren" },
  { id: 2, title: "SUID Dosyalari Bul", description: "find komutuyla SUID bit ayarli dosyalari tara" },
  { id: 3, title: "Exploit Et", description: "SUID binary'yi kullanarak root erisimi kazan" },
  { id: 4, title: "Flagi Yakala", description: "/root/flag.txt dosyasini oku" },
]

export function LinuxPrivescLab({ isOpen, onClose }: LinuxPrivescLabProps) {
  const [history, setHistory] = useState<Array<{ command: string; output: string; outputType?: string }>>([
    {
      command: "",
      output: `
╔══════════════════════════════════════════════════════════════╗
║      LINUX PRIVILEGE ESCALATION - Whoami Security Lab        ║
╠══════════════════════════════════════════════════════════════╣
║  Hedef: Dusuk yetkili bir kullanicidan root erisimi elde et  ║
║  SUID binary'leri kullanarak yetki yukseltme yap             ║
╚══════════════════════════════════════════════════════════════╝

[*] SSH ile hedef sisteme baglandiniz
[*] Kullanici: lowuser
[*] Hedef: root erisimi elde et

'help' yazarak kullanilabilir komutlari gorun.
`,
      outputType: "system"
    }
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const [answer, setAnswer] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showCertificate, setShowCertificate] = useState(false)
  const [isRoot, setIsRoot] = useState(false)
  const [currentUser, setCurrentUser] = useState("lowuser")
  
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, startTime])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const processCommand = (cmd: string): { output: string; outputType?: string } => {
    const parts = cmd.trim().split(/\s+/)
    const command = parts[0]?.toLowerCase()
    const args = parts.slice(1)

    switch (command) {
      case "help":
        return {
          output: `Kullanilabilir komutlar:
  help      - Bu yardim menusunu goster
  whoami    - Mevcut kullaniciyi goster
  id        - Kullanici ID ve grup bilgilerini goster
  pwd       - Mevcut dizini goster
  ls        - Dizin icerigini listele
  cat       - Dosya icerigini oku
  find      - Dosya ara (ornek: find / -perm -4000)
  sudo      - Root komutu calistir (parola gerekli)
  ./        - Program calistir
  clear     - Terminali temizle
  
Privilege Escalation Ipuclari:
  - SUID bitli dosyalari ara
  - GTFOBins'i arastir`
        }

      case "whoami":
        if (!completedSteps.includes(1)) {
          setCompletedSteps(prev => [...prev, 1])
        }
        return { output: currentUser }

      case "id":
        if (!completedSteps.includes(1)) {
          setCompletedSteps(prev => [...prev, 1])
        }
        if (isRoot) {
          return { output: "uid=0(root) gid=0(root) groups=0(root)" }
        }
        return { output: "uid=1001(lowuser) gid=1001(lowuser) groups=1001(lowuser)" }

      case "pwd":
        return { output: isRoot ? "/root" : "/home/lowuser" }

      case "ls":
        const path = args[0] || ""
        if (path === "/root" || path === "/root/") {
          if (isRoot) {
            return { output: "flag.txt  .bashrc  .ssh/" }
          }
          return { output: "ls: cannot open directory '/root': Permission denied", outputType: "error" }
        }
        if (path === "-la" || path === "-l") {
          return {
            output: `total 16
drwxr-xr-x 2 lowuser lowuser 4096 Apr 10 10:00 .
drwxr-xr-x 4 root    root    4096 Apr 10 09:00 ..
-rw-r--r-- 1 lowuser lowuser  220 Apr 10 09:00 .bashrc
-rw-r--r-- 1 lowuser lowuser   50 Apr 10 10:00 notes.txt`
          }
        }
        return { output: "notes.txt" }

      case "cat":
        const file = args[0] || ""
        if (file === "/root/flag.txt") {
          if (isRoot) {
            if (!completedSteps.includes(4)) {
              setCompletedSteps(prev => [...prev, 4])
            }
            return {
              output: `TEBRIKLER! Root erisimi basarili!

${secretFlag}

Bu flagi cevap kutusuna yazarak labi tamamla.`,
              outputType: "success"
            }
          }
          return { output: "cat: /root/flag.txt: Permission denied", outputType: "error" }
        }
        if (file === "notes.txt") {
          return {
            output: `Notlar:
- Sistem yoneticisi garip SUID ayarlari yapmis olabilir
- /usr/bin klasorunu kontrol et
- find / -perm -4000 2>/dev/null komutu faydali olabilir`
          }
        }
        return { output: `cat: ${file}: No such file or directory`, outputType: "error" }

      case "find":
        const findArgs = args.join(" ")
        if (findArgs.includes("-perm") && (findArgs.includes("4000") || findArgs.includes("-u=s"))) {
          if (!completedSteps.includes(2)) {
            setCompletedSteps(prev => [...prev, 2])
          }
          return {
            output: `/usr/bin/passwd
/usr/bin/sudo
/usr/bin/find
/usr/bin/vim.basic
/usr/bin/python3.8

[!] Ilginc SUID binary'ler bulundu!
    /usr/bin/find - GTFOBins'de privilege escalation mumkun
    /usr/bin/python3.8 - Shell spawn edilebilir

Ipucu: /usr/bin/find . -exec /bin/sh -p \\; deneyin`,
            outputType: "success"
          }
        }
        return { output: "find: ornek kullanim: find / -perm -4000 2>/dev/null" }

      case "sudo":
        return { output: "[sudo] password for lowuser: \nSorry, user lowuser is not in the sudoers file.", outputType: "error" }

      case "/usr/bin/find":
      case "./find":
        if (args.includes("-exec") && (args.includes("/bin/sh") || args.includes("/bin/bash"))) {
          if (!completedSteps.includes(3)) {
            setCompletedSteps(prev => [...prev, 3])
          }
          setIsRoot(true)
          setCurrentUser("root")
          return {
            output: `[!] SUID Exploit Basarili!
            
# whoami
root

# id  
uid=0(root) gid=0(root) groups=0(root)

[*] ROOT ERISIMI KAZANILDI!
[*] Simdi /root/flag.txt dosyasini okuyabilirsiniz.`,
            outputType: "success"
          }
        }
        return { output: "Usage: find [-exec command \\;]" }

      case "/usr/bin/python3.8":
        if (args.includes("-c") && args.some(a => a.includes("os.execl") || a.includes("setuid"))) {
          if (!completedSteps.includes(3)) {
            setCompletedSteps(prev => [...prev, 3])
          }
          setIsRoot(true)
          setCurrentUser("root")
          return {
            output: `[!] Python SUID Exploit Basarili!
            
ROOT ERISIMI KAZANILDI!
Simdi /root/flag.txt dosyasini okuyabilirsiniz.`,
            outputType: "success"
          }
        }
        return { output: "Python 3.8.10 - Use: python3.8 -c 'import os;os.setuid(0);os.execl(\"/bin/sh\",\"sh\")'" }

      case "clear":
        setHistory([])
        return { output: "" }

      case "":
        return { output: "" }

      default:
        return { output: `bash: ${command}: command not found` }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = processCommand(currentInput)
    
    if (currentInput.toLowerCase().trim() === "clear") {
      setCurrentInput("")
      return
    }

    setHistory((prev) => [...prev, { command: currentInput, output: result.output, outputType: result.outputType }])
    setCurrentInput("")
  }

  const handleAnswerSubmit = () => {
    if (answer.trim().toUpperCase() === secretFlag) {
      setIsCompleted(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative bg-cyber-dark border border-red-500/50 rounded-lg shadow-2xl shadow-red-500/20 flex flex-col transition-all duration-300 ${
        isMaximized ? "w-full h-full" : "w-full max-w-6xl h-[85vh]"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
              <button onClick={() => setIsMaximized(false)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
              <button onClick={() => setIsMaximized(true)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-red-500" />
              <span className="text-sm font-mono text-muted-foreground">Linux Privilege Escalation Lab</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-cyber-green">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-red-500">{completedSteps.length}/4</span>
            </div>
            {isRoot && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded text-red-400 text-xs font-bold">
                <Skull className="w-3 h-3" />
                ROOT
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Terminal */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, index) => (
                <div key={index} className="mb-2">
                  {item.command && (
                    <div className="flex items-center gap-2">
                      <span className={isRoot ? "text-red-500" : "text-cyber-green"}>{currentUser}@target</span>
                      <span className="text-muted-foreground">:</span>
                      <span className="text-cyber-blue">~</span>
                      <span className="text-muted-foreground">{isRoot ? "#" : "$"}</span>
                      <span className="text-foreground ml-1">{item.command}</span>
                    </div>
                  )}
                  {item.output && (
                    <pre className={`whitespace-pre-wrap mt-1 ${
                      item.outputType === "success" ? "text-cyber-green" :
                      item.outputType === "error" ? "text-red-400" :
                      item.outputType === "system" ? "text-red-400" :
                      "text-muted-foreground"
                    }`}>{item.output}</pre>
                  )}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className={isRoot ? "text-red-500" : "text-cyber-green"}>{currentUser}@target</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-cyber-blue">~</span>
                <span className="text-muted-foreground">{isRoot ? "#" : "$"}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground ml-1"
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          </div>

          {/* Task Panel */}
          <div className="w-80 border-l border-border/50 bg-muted/20 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Skull className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-foreground">Linux Privesc Lab</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Dusuk yetkili bir kullanicidan SUID binary'leri kullanarak root erisimi kazan.
              </p>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Gorevler</h4>
              <div className="space-y-3">
                {labSteps.map((step) => (
                  <div 
                    key={step.id}
                    className={`p-3 rounded-lg border transition-all ${
                      completedSteps.includes(step.id)
                        ? "bg-cyber-green/10 border-cyber-green/30"
                        : "bg-muted/30 border-border/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-cyber-green mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${completedSteps.includes(step.id) ? "text-cyber-green" : "text-foreground"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hint */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? "Ipucunu Gizle" : "Ipucu Goster"}
                </Button>
                {showHint && (
                  <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200">
                    <p className="mb-2"><strong>SUID Privilege Escalation:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>SUID bul: <code>find / -perm -4000</code></li>
                      <li>GTFOBins kontrol et</li>
                      <li>find exploit: <code>/usr/bin/find . -exec /bin/sh -p \;</code></li>
                    </ol>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Section */}
            <div className="p-4 border-t border-border/50">
              <label className="block text-sm font-medium text-foreground mb-2">Flagi Gir</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="WHOAMI{...}"
                  className="flex-1 px-3 py-2 bg-cyber-dark/50 border border-border/50 rounded-lg text-sm focus:border-red-500 outline-none"
                />
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={isCompleted}
                  className={isCompleted ? "bg-cyber-green" : "bg-red-500 hover:bg-red-600"}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : "Gonder"}
                </Button>
              </div>
              
              {isCompleted && (
                <div className="mt-4 p-4 bg-cyber-green/10 border border-cyber-green/50 rounded-lg">
                  <p className="text-sm text-cyber-green font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Tebrikler! Lab tamamlandi!
                  </p>
                  <Button
                    onClick={() => setShowCertificate(true)}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 text-white font-semibold"
                  >
                    Sertifikani Al
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        labName="Linux Privilege Escalation"
        userName="Ogrenci"
        completionDate={new Date().toLocaleDateString('tr-TR')}
      />
    </div>
  )
}
