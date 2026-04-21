"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2, Bot } from "lucide-react"

// Offline AI Mentor responses (no API required)
const mentorResponses: Record<string, string> = {
  "sql injection": "SQL Injection, web uygulamalarinda en yaygin guvenlik aciklaridir. Saldirgan, kullanici girislerine zararli SQL kodlari ekleyerek veritabanina yetkisiz erisim saglar.\n\nOrnek: ' OR '1'='1' -- \n\nKorunma: Parametreli sorgular (prepared statements) kullanin, girdi dogrulamasi yapin ve ORM kullanimindan imkansizsa.",
  "xss": "XSS (Cross-Site Scripting), saldirganin web sayfasina zararli JavaScript kodu enjekte etmesidir.\n\nUc turu vardir:\n1. Stored XSS - Veritabaninda saklanir\n2. Reflected XSS - URL parametresinden yansir\n3. DOM-based XSS - Client-side'da olusur\n\nKorunma: HTML encoding, Content Security Policy (CSP) kullanin.",
  "phishing": "Phishing, sahte e-postalar veya web siteleri kullanarak kullanicilari kandirma teknigdir.\n\nBelirtileri:\n- Acil eylem isteyen mesajlar\n- Supheli gonderen adresleri\n- Kotu yazilmis icerik\n- Sahte URL'ler\n\nKorunma: URL'leri kontrol edin, 2FA kullanin, e-posta basliklarini inceleyin.",
  "penetration test": "Penetration Testing (Sizme Testi), sistemlerin guvenligini test etmek icin yetkilendirilmis saldiri simulasyonudur.\n\nAsamalari:\n1. Keif (Reconnaissance)\n2. Tarama (Scanning)\n3. Erisim Kazanma\n4. Erisimi Surdurumo\n5. Raporlama\n\nAraclar: Nmap, Burp Suite, Metasploit, Wireshark",
  "firewall": "Firewall, ag trafiginini izleyen ve belirli kurallara gore filtreleyen guvenlik sistemidir.\n\nTurleri:\n1. Packet Filtering - IP/Port bazli\n2. Stateful Inspection - Baglanti durumunu takip eder\n3. Application Layer - Uygulama protokollerini inceler\n4. Next-Gen (NGFW) - IPS, DPI iceren gelismis sistemler",
  "encryption": "Sifreleme, verileri okunmaz hale getiren guvenlik yontemidir.\n\nTurleri:\n1. Simetrik (AES, DES) - Ayni anahtar\n2. Asimetrik (RSA, ECC) - Public/Private anahtar cifti\n3. Hash (SHA-256, MD5) - Tek yonlu donusum\n\nKullanim: HTTPS, VPN, Disk sifreleme, E-posta",
  "malware": "Malware (Zararli Yazilim), sistemlere zarar vermek icin tasarlanmis yazilimlardir.\n\nTurleri:\n1. Virus - Kendini kopyalar\n2. Worm - Ag uzerinden yayilir\n3. Trojan - Masum gorunur\n4. Ransomware - Dosyalari sifreler, fidye ister\n5. Spyware - Bilgi calar\n\nKorunma: Antiviris, guncellemeler, dikkatli indirme",
  "default": "Siber guvenlik hakkinda sordugunuz konuyu arastiriyorum...\n\nBu konuda size yardimci olabilecegim temel bilgiler:\n- Siber guvenlik, sistemleri ve verileri koruma bilimidir\n- Temel alanlar: Ag guvenligi, Uygulama guvenligi, Bilgi guvenligi\n- Onemli kavramlar: CIA Triad (Gizlilik, Butunluk, Erisilebilirlik)\n\nDaha spesifik bir soru sormak ister misiniz? Ornegin: 'ask sql injection nedir' veya 'ask xss'"
}

function getMentorResponse(question: string): string {
  const q = question.toLowerCase()
  
  for (const [key, response] of Object.entries(mentorResponses)) {
    if (key !== "default" && q.includes(key)) {
      return response
    }
  }
  
  // Check for common keywords
  if (q.includes("sifre") || q.includes("password") || q.includes("hash")) {
    return mentorResponses["encryption"]
  }
  if (q.includes("virus") || q.includes("trojan") || q.includes("ransomware")) {
    return mentorResponses["malware"]
  }
  if (q.includes("pentest") || q.includes("sizme") || q.includes("hack")) {
    return mentorResponses["penetration test"]
  }
  
  return mentorResponses["default"]
}

interface FileSystemNode {
  [key: string]: FileSystemNode | string
}

const fileSystem: FileSystemNode = {
  home: {
    user: {
      Desktop: {
        "flag.txt": "FLAG{welcome_to_whoami_2026}",
        "notlar.txt": "Siber guvenlik ogrenmeye basladim!",
        projeler: {
          "script.py": "#!/usr/bin/env python3\nprint('Merhaba Dunya!')",
          "hack.sh": "#!/bin/bash\necho 'Etik hacker olacagim!'",
        },
      },
      Documents: {
        "odevler.txt": "1. Ag guvenligi arastirmasi\n2. SQL injection lab'i tamamla",
        "sifreler_SAKLA.txt": "admin:12345 (Bu kotu bir pratik!)",
      },
      Downloads: {
        "wireshark_capture.pcap": "[Binary dosya - Wireshark ile acilabilir]",
        "malware_sample.zip": "[Supheli dosya - Dikkat!]",
      },
      ".ssh": {
        "id_rsa": "[Gizli anahtar dosyasi]",
        "id_rsa.pub": "ssh-rsa AAAAB3NzaC1... user@whoami-lab",
      },
      ".bashrc": "export PATH=$PATH:/usr/local/bin\nalias ll='ls -la'",
    },
  },
  etc: {
    passwd: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000::/home/user:/bin/bash",
    shadow: "[Erisim reddedildi - root yetkisi gerekli]",
    hosts: "127.0.0.1   localhost\n192.168.1.1 router",
  },
  var: {
    log: {
      "auth.log": "Mar 25 10:15:23 sshd: Failed password for root from 192.168.1.105\nMar 25 10:15:45 sshd: Accepted password for user",
      "syslog": "Mar 25 10:00:00 kernel: Linux version 5.15.0-whoami",
    },
  },
  tmp: {
    ".hidden_file": "Gizli veri bulundu!",
  },
}

const networkConnections = [
  { proto: "tcp", local: "0.0.0.0:22", foreign: "0.0.0.0:*", state: "LISTEN", program: "sshd" },
  { proto: "tcp", local: "127.0.0.1:3306", foreign: "0.0.0.0:*", state: "LISTEN", program: "mysqld" },
  { proto: "tcp", local: "192.168.1.100:22", foreign: "192.168.1.105:54321", state: "ESTABLISHED", program: "sshd" },
  { proto: "tcp", local: "192.168.1.100:443", foreign: "142.250.187.46:443", state: "ESTABLISHED", program: "firefox" },
  { proto: "udp", local: "0.0.0.0:68", foreign: "0.0.0.0:*", state: "", program: "dhclient" },
]

interface TerminalPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function TerminalPanel({ isOpen, onClose }: TerminalPanelProps) {
  const [aiMode, setAiMode] = useState(false)

  const [history, setHistory] = useState<Array<{ command: string; output: string; outputType?: string }>>([
    {
      command: "",
      output: `
 █     █░ ██░ ██  ▒█████   ▄▄▄       ███▄ ▄███▓ ██▓
▓█░ █ ░█░▓██░ ██▒▒██▒  ██▒▒████▄    ▓██▒▀█▀ ██▒▓██▒
▒█░ █ ░█ ▒██▀▀██░▒██░  ██▒▒██  ▀█▄  ▓██    ▓██░▒██▒
░█░ █ ░█ ░▓█ ░██ ▒██   ██░░██▄▄▄▄██ ▒██    ▒██ ░██░
░░██▒██▓ ░▓█▒░██▓░ ████▓▒░ ▓█   ▓██▒▒██▒   ░██▒░██░
░ ▓░▒ ▒   ▒ ░░▒░▒░ ▒░▒░▒░  ▒▒   ▓▒█░░ ▒░   ░  ░░▓  
  ▒ ░ ░   ▒ ░▒░ ░  ░ ▒ ▒░   ▒   ▒▒ ░░  ░      ░ ▒ ░
  ░   ░   ░  ░░ ░░ ░ ░ ▒    ░   ▒   ░      ░    ▒ ░
    ░     ░  ░  ░    ░ ░        ░  ░       ░    ░  

   Whoami Prototip Terminal v1.0 - Siber Guvenlik Egitim Ortami
   "Gelecegin Siber Guvenlik Uzmani"
   
   Komutlar icin 'help' yazin.
   
   [YENİ] AI Mentor icin 'mentor' veya 'ask <soru>' yazin!
`,
      outputType: "banner",
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentPath, setCurrentPath] = useState("/home/user")
  const [isMaximized, setIsMaximized] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

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

  const getDirectoryContent = (path: string): FileSystemNode | string | null => {
    const parts = path.split("/").filter(Boolean)
    let current: FileSystemNode | string = fileSystem

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
  help     - Bu yardim mesajini goster
  ls       - Dizin icerigini listele (ls -la icin gizli dosyalar dahil)
  cd       - Dizin degistir (cd .., cd /path)
  cat      - Dosya icerigini goster
  pwd      - Mevcut dizini goster
  whoami   - Kim oldugunu ogren
  clear    - Terminali temizle
  netstat  - Ag baglantilarini goster
  hostname - Sistem adini goster
  date     - Tarih ve saati goster
  uname    - Sistem bilgisini goster
  id       - Kullanici ID bilgisini goster
  echo     - Metin yazdir
  history  - Komut gecmisini goster
  
  [AI MENTOR]
  mentor   - AI Mentor modunu ac/kapat
  ask <soru> - AI Mentor'a soru sor (ornek: ask sql injection nedir?)`,
        }

      case "ls": {
        const content = getDirectoryContent(currentPath)
        if (typeof content === "string" || content === null) {
          return { output: "ls: dizin okunamiyor" }
        }
        const showHidden = args.includes("-la") || args.includes("-a") || args.includes("-al")
        const showLong = args.includes("-la") || args.includes("-al") || args.includes("-l")
        const entries = Object.keys(content)
        const visibleEntries = showHidden ? entries : entries.filter((e) => !e.startsWith("."))
        
        if (showLong) {
          const output = visibleEntries.map((entry) => {
            const isDir = typeof content[entry] === "object"
            const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--"
            const size = isDir ? "4096" : "1024"
            return `${perms}  1 user user  ${size.padStart(5)} Mar 25 10:00 ${entry}${isDir ? "/" : ""}`
          })
          return { output: `toplam ${visibleEntries.length * 4}\n` + output.join("\n"), outputType: "ls" }
        }
        
        return { 
          output: visibleEntries.map((e) => {
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
          const parts = currentPath.split("/").filter(Boolean)
          if (parts.length > 0) {
            parts.pop()
            setCurrentPath("/" + parts.join("/") || "/")
          }
          return { output: "" }
        }
        if (args[0] === "/") {
          setCurrentPath("/")
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
        return { output: content }
      }

      case "pwd":
        return { output: currentPath || "/" }

      case "whoami":
        return { output: "Gelecegin Siber Guvenlik Uzmani", outputType: "special" }

      case "kadir":
        return { output: "rumeysanin kocasi?!", outputType: "special" }

      case "clear":
        setHistory([])
        return { output: "" }

      case "hostname":
        return { output: "whoami-lab" }

      case "date":
        return {
          output: new Date().toLocaleString("tr-TR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }

      case "uname":
        if (args.includes("-a")) {
          return { output: "Linux whoami-lab 5.15.0-whoami #1 SMP x86_64 GNU/Linux" }
        }
        return { output: "Linux" }

      case "id":
        return { output: "uid=1000(user) gid=1000(user) groups=1000(user),27(sudo),1001(cyber)" }

      case "netstat":
        const header = "Proto  Local Address          Foreign Address        State       Program"
        const separator = "-".repeat(75)
        const rows = networkConnections.map(
          (conn) =>
            `${conn.proto.padEnd(6)} ${conn.local.padEnd(22)} ${conn.foreign.padEnd(22)} ${conn.state.padEnd(12)} ${conn.program}`
        )
        return { output: `Aktif Internet baglantilari:\n${header}\n${separator}\n${rows.join("\n")}` }

      case "echo":
        return { output: args.join(" ") }

      case "history":
        if (commandHistory.length === 0) {
          return { output: "Komut gecmisi bos" }
        }
        return { output: commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n") }

      case "mentor":
        setAiMode(!aiMode)
        return { 
          output: !aiMode 
            ? `[CyberMentor] AI Mentor modu AKTIF!\nSimdi dogrudan sorularinizi yazabilirsiniz.\nKapatmak icin tekrar 'mentor' yazin.`
            : `[CyberMentor] AI Mentor modu KAPALI.\nNormal terminal moduna donuldu.`,
          outputType: "ai"
        }

      case "ask":
        if (args.length === 0) {
          return { output: "Kullanim: ask <sorunuz>\nOrnek: ask sql injection nedir?" }
        }
        // Return special marker for AI question
        return { output: "__AI_QUESTION__:" + args.join(" "), outputType: "ai-pending" }

      case "":
        return { output: "" }

      default:
        // If in AI mode, treat as a question
        if (aiMode) {
          return { output: "__AI_QUESTION__:" + cmd, outputType: "ai-pending" }
        }
        return { output: `${command}: komut bulunamadi. Yardim icin 'help' yazin.` }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = currentInput.trim()
    
    if (trimmedInput) {
      setCommandHistory(prev => [...prev, trimmedInput])
      setHistoryIndex(-1)
    }

    const result = processCommand(currentInput)
    
    if (currentInput.toLowerCase().trim() === "clear") {
      setCurrentInput("")
      return
    }

    // Handle AI questions with offline responses
    if (result.outputType === "ai-pending" && result.output.startsWith("__AI_QUESTION__:")) {
      const question = result.output.replace("__AI_QUESTION__:", "")
      
      // Show typing indicator briefly, then show response
      setHistory((prev) => [...prev, { 
        command: currentInput, 
        output: "[CyberMentor] Dusunuyor...", 
        outputType: "ai-typing" 
      }])
      
      // Simulate thinking delay then show response
      setTimeout(() => {
        const response = getMentorResponse(question)
        setHistory(prev => {
          const updated = [...prev]
          const lastIdx = updated.findIndex(h => h.outputType === "ai-typing")
          if (lastIdx !== -1) {
            updated[lastIdx] = {
              ...updated[lastIdx],
              output: `[CyberMentor] ${response}`,
              outputType: "ai"
            }
          }
          return updated
        })
      }, 800 + Math.random() * 700) // Random delay between 800-1500ms
      
      setCurrentInput("")
      return
    }

    setHistory((prev) => [...prev, { command: currentInput, output: result.output, outputType: result.outputType }])
    setCurrentInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const content = getDirectoryContent(currentPath)
      if (typeof content === "object" && content !== null) {
        const parts = currentInput.split(/\s+/)
        const lastPart = parts[parts.length - 1] || ""
        const matches = Object.keys(content).filter((k) => k.startsWith(lastPart))
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0]
          setCurrentInput(parts.join(" "))
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
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
    }
  }

  if (!isOpen) return null

  const getShortPath = (path: string) => {
    if (path === "/home/user") return "~"
    if (path.startsWith("/home/user/")) return "~" + path.slice(10)
    return path
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-cyber-dark border-l border-cyber-blue/30 flex flex-col z-50 transition-all duration-300 ${
        isMaximized ? "w-full" : "w-full md:w-1/2 lg:w-2/5"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-gray/80 border-b border-cyber-blue/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:brightness-110" onClick={onClose} />
            <div
              className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:brightness-110"
              onClick={() => setIsMaximized(false)}
            />
            <div
              className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:brightness-110"
              onClick={() => setIsMaximized(true)}
            />
          </div>
          <span className="text-sm text-muted-foreground font-mono">root@whoami ~ terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 hover:bg-cyber-blue/10 rounded text-muted-foreground hover:text-cyber-blue transition-colors"
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
                    <span className="text-cyber-green">root@whoami</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-cyber-blue">{getShortPath(currentPath)}</span>
                    <span className="text-muted-foreground">$</span>
                    <span className="text-foreground">{item.command}</span>
                  </div>
                )}
                {item.output && (
                  <pre className={`whitespace-pre-wrap mt-1 ${
                    item.outputType === "special" ? "text-cyber-purple font-bold" : 
                    item.outputType === "ai" ? "text-cyber-green" :
                    item.outputType === "ai-typing" ? "text-cyber-green animate-pulse" :
                    "text-muted-foreground"
                  }`}>
                    {(item.outputType === "ai" || item.outputType === "ai-typing") && (
                      <span className="inline-flex items-center gap-1 mr-1">
                        <Bot className="w-3 h-3 inline" />
                      </span>
                    )}
                    {item.output}
                  </pre>
                )}
              </>
            )}
          </div>
        ))}

        {/* Current Input Line */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <span className="text-cyber-green">root@whoami</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-cyber-blue">{getShortPath(currentPath)}</span>
            <span className="text-muted-foreground">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </form>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-cyber-gray/50 border-t border-cyber-blue/20 flex items-center justify-between text-xs text-muted-foreground">
        <span>Whoami Prototip Terminal v1.0</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
          Bagli
        </span>
      </div>
    </div>
  )
}
