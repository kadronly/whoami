"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2, CheckCircle2, Circle, Database, Terminal, Lightbulb, Trophy, Clock, Target, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CertificateModal } from "@/components/certificate-modal"

interface SQLInjectionLabProps {
  isOpen: boolean
  onClose: () => void
}

// Simulated database
const usersTable = [
  { id: 1, username: "admin", password: "sup3rs3cr3t", role: "admin" },
  { id: 2, username: "user1", password: "pass123", role: "user" },
  { id: 3, username: "guest", password: "guest", role: "guest" },
]

const secretFlag = "WHOAMI{sql_1nj3ct10n_m4st3r}"

const labSteps = [
  { id: 1, title: "Veritabanini Kesfet", description: "tables komutunu kullanarak veritabani tablolarini listele" },
  { id: 2, title: "Login Sayfasini Bypass Et", description: "SQL injection ile login sayfasini atla" },
  { id: 3, title: "Admin Parolasini Bul", description: "UNION attack ile admin kullanicisinin parolasini bul" },
  { id: 4, title: "Flagi Yakala", description: "Gizli flagi bul ve cevap kutusuna yaz" },
]

export function SQLInjectionLab({ isOpen, onClose }: SQLInjectionLabProps) {
  const [history, setHistory] = useState<Array<{ command: string; output: string; outputType?: string }>>([
    {
      command: "",
      output: `
╔══════════════════════════════════════════════════════════════╗
║         SQL INJECTION LAB - Whoami Security Platform         ║
╠══════════════════════════════════════════════════════════════╣
║  Hedef: Savunmasiz bir web uygulamasinin veritabanina        ║
║  SQL injection saldirisi yaparak gizli bilgilere eris        ║
╚══════════════════════════════════════════════════════════════╝

Kullanilabilir komutlar:
  help     - Yardim menusunu goster
  tables   - Veritabani tablolarini listele
  login <username> <password> - Login denemesi yap
  query <SQL>   - Dogrudan SQL sorgusu calistir
  clear    - Terminali temizle

Ipucu: SQL injection icin ' karakterini deneyin!
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
  const [loginBypassed, setLoginBypassed] = useState(false)
  const [adminPasswordFound, setAdminPasswordFound] = useState(false)
  
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
  help     - Bu yardim menusunu goster
  tables   - Veritabani tablolarini listele
  login <username> <password> - Login denemesi yap
  query <SQL>   - Dogrudan SQL sorgusu calistir
  clear    - Terminali temizle
  
SQL Injection Ipuclari:
  ' OR '1'='1     - Klasik bypass
  ' UNION SELECT  - Data extraction
  ' --            - Yorum satiri`
        }

      case "tables":
        if (!completedSteps.includes(1)) {
          setCompletedSteps(prev => [...prev, 1])
        }
        return {
          output: `Veritabani tablolari:
+----------------+
| Tables         |
+----------------+
| users          |
| sessions       |
| secret_flags   |
+----------------+

Ipucu: users tablosunda ilginc bilgiler olabilir...`
        }

      case "login":
        const username = args[0] || ""
        const password = args[1] || ""
        
        // Check for SQL injection
        if (username.includes("'") || password.includes("'")) {
          // Classic SQL injection bypass
          if (username.includes("' OR '1'='1") || password.includes("' OR '1'='1") || 
              username.includes("' OR 1=1") || password.includes("' OR 1=1") ||
              username.includes("'--") || password.includes("'--")) {
            if (!completedSteps.includes(2)) {
              setCompletedSteps(prev => [...prev, 2])
              setLoginBypassed(true)
            }
            return {
              output: `[!] SQL Injection Basarili!

Sorgu: SELECT * FROM users WHERE username='${username}' AND password='${password}'

Sonuc: Login bypass edildi! Admin paneline erisim saglandi.

Simdi UNION attack ile admin parolasini bul:
  query ' UNION SELECT username, password FROM users--`,
              outputType: "success"
            }
          }
          return {
            output: `[!] SQL Hatasi Tespit Edildi!
Sorgu: SELECT * FROM users WHERE username='${username}' AND password='${password}'

Error: near "'": syntax error

Ipucu: ' OR '1'='1 veya ' OR 1=1-- deneyin`,
            outputType: "error"
          }
        }
        
        // Normal login check
        const user = usersTable.find(u => u.username === username && u.password === password)
        if (user) {
          return { output: `Hosgeldin, ${user.username}! Rol: ${user.role}` }
        }
        return { output: "Hatali kullanici adi veya parola!", outputType: "error" }

      case "query":
        const sql = args.join(" ")
        
        // UNION attack to get passwords
        if (sql.toLowerCase().includes("union") && sql.toLowerCase().includes("select")) {
          if (!completedSteps.includes(3)) {
            setCompletedSteps(prev => [...prev, 3])
            setAdminPasswordFound(true)
          }
          return {
            output: `Sorgu calistiriliyor: ${sql}

+----------+-------------+
| username | password    |
+----------+-------------+
| admin    | sup3rs3cr3t |
| user1    | pass123     |
| guest    | guest       |
+----------+-------------+

[!] Admin parolasi bulundu: sup3rs3cr3t

Simdi secret_flags tablosunu sorgula:
  query SELECT * FROM secret_flags`,
            outputType: "success"
          }
        }

        // Query secret_flags table
        if (sql.toLowerCase().includes("secret_flags")) {
          if (!completedSteps.includes(4)) {
            setCompletedSteps(prev => [...prev, 4])
          }
          return {
            output: `Sorgu calistiriliyor: ${sql}

+----+--------------------------------+
| id | flag                           |
+----+--------------------------------+
| 1  | ${secretFlag} |
+----+--------------------------------+

TEBRIKLER! Flagi buldun! Cevap kutusuna yaz.`,
            outputType: "success"
          }
        }

        return {
          output: `Sorgu calistiriliyor: ${sql}
          
Sonuc: 0 rows returned

Ipucu: UNION SELECT ile tablolari birlestirmeyi dene`,
          outputType: "info"
        }

      case "clear":
        setHistory([])
        return { output: "" }

      case "":
        return { output: "" }

      default:
        return { output: `Komut bulunamadi: ${command}. 'help' yazarak yardim alin.` }
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
      
      <div className={`relative bg-cyber-dark border border-cyber-purple/50 rounded-lg shadow-2xl shadow-cyber-purple/20 flex flex-col transition-all duration-300 ${
        isMaximized ? "w-full h-full" : "w-full max-w-6xl h-[85vh]"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-cyber-purple/20 to-orange-500/20 border-b border-cyber-purple/30 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
              <button onClick={() => setIsMaximized(false)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
              <button onClick={() => setIsMaximized(true)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyber-purple" />
              <span className="text-sm font-mono text-muted-foreground">SQL Injection Lab</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-cyber-green">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-cyber-purple">{completedSteps.length}/4</span>
            </div>
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
                      <span className="text-cyber-purple">hacker@sqllab</span>
                      <span className="text-muted-foreground">:</span>
                      <span className="text-cyber-blue">~</span>
                      <span className="text-muted-foreground">$</span>
                      <span className="text-foreground ml-1">{item.command}</span>
                    </div>
                  )}
                  {item.output && (
                    <pre className={`whitespace-pre-wrap mt-1 ${
                      item.outputType === "success" ? "text-cyber-green" :
                      item.outputType === "error" ? "text-red-400" :
                      item.outputType === "system" ? "text-cyber-purple" :
                      "text-muted-foreground"
                    }`}>{item.output}</pre>
                  )}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-cyber-purple">hacker@sqllab</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-cyber-blue">~</span>
                <span className="text-muted-foreground">$</span>
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
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-foreground">SQL Injection Lab</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Savunmasiz bir web uygulamasina SQL injection saldirisi yap ve gizli verilere eris.
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
                    <p className="mb-2"><strong>SQL Injection Temelleri:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Login bypass: <code>' OR '1'='1</code></li>
                      <li>UNION attack: <code>' UNION SELECT * FROM users--</code></li>
                      <li>Yorum satiri: <code>--</code> veya <code>#</code></li>
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
                  className="flex-1 px-3 py-2 bg-cyber-dark/50 border border-border/50 rounded-lg text-sm focus:border-cyber-purple outline-none"
                />
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={isCompleted}
                  className={isCompleted ? "bg-cyber-green" : "bg-cyber-purple hover:bg-cyber-purple/90"}
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
                    className="w-full bg-gradient-to-r from-cyber-purple to-orange-500 hover:opacity-90 text-white font-semibold"
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
        labName="SQL Injection"
        userName="Ogrenci"
        completionDate={new Date().toLocaleDateString('tr-TR')}
      />
    </div>
  )
}
