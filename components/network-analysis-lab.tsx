"use client"

import { useState, useRef, useEffect } from "react"
import { 
  X, Minimize2, Maximize2, CheckCircle2, Circle, Wifi, Lightbulb, 
  Trophy, Clock, Target, AlertTriangle, Eye, Filter, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CertificateModal } from "@/components/certificate-modal"

interface NetworkAnalysisLabProps {
  isOpen: boolean
  onClose: () => void
}

// Simulated network packets
const networkPackets = [
  { id: 1, time: "0.000000", src: "192.168.1.100", dst: "192.168.1.1", protocol: "ARP", length: 42, info: "Who has 192.168.1.1? Tell 192.168.1.100" },
  { id: 2, time: "0.000234", src: "192.168.1.1", dst: "192.168.1.100", protocol: "ARP", length: 42, info: "192.168.1.1 is at aa:bb:cc:dd:ee:ff" },
  { id: 3, time: "0.001567", src: "192.168.1.100", dst: "8.8.8.8", protocol: "DNS", length: 74, info: "Standard query A malicious-site.com" },
  { id: 4, time: "0.045123", src: "8.8.8.8", dst: "192.168.1.100", protocol: "DNS", length: 90, info: "Standard query response A 185.199.108.153" },
  { id: 5, time: "0.046789", src: "192.168.1.100", dst: "185.199.108.153", protocol: "TCP", length: 66, info: "[SYN] Seq=0 Win=64240 Len=0" },
  { id: 6, time: "0.089456", src: "185.199.108.153", dst: "192.168.1.100", protocol: "TCP", length: 66, info: "[SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0" },
  { id: 7, time: "0.089678", src: "192.168.1.100", dst: "185.199.108.153", protocol: "TCP", length: 54, info: "[ACK] Seq=1 Ack=1 Win=64240 Len=0" },
  { id: 8, time: "0.090123", src: "192.168.1.100", dst: "185.199.108.153", protocol: "HTTP", length: 412, info: "GET /login.php?user=admin&pass=secret123 HTTP/1.1" },
  { id: 9, time: "0.134567", src: "185.199.108.153", dst: "192.168.1.100", protocol: "HTTP", length: 1240, info: "HTTP/1.1 200 OK (text/html)" },
  { id: 10, time: "0.200123", src: "192.168.1.100", dst: "192.168.1.50", protocol: "TCP", length: 66, info: "[SYN] Seq=0 Win=64240 Len=0 - Port Scan Detected" },
  { id: 11, time: "0.200456", src: "192.168.1.100", dst: "192.168.1.50", protocol: "TCP", length: 66, info: "[SYN] Seq=0 Win=64240 Len=0 - Port 22 SSH" },
  { id: 12, time: "0.200789", src: "192.168.1.100", dst: "192.168.1.50", protocol: "TCP", length: 66, info: "[SYN] Seq=0 Win=64240 Len=0 - Port 80 HTTP" },
  { id: 13, time: "0.201012", src: "192.168.1.100", dst: "192.168.1.50", protocol: "TCP", length: 66, info: "[SYN] Seq=0 Win=64240 Len=0 - Port 443 HTTPS" },
  { id: 14, time: "0.300456", src: "192.168.1.100", dst: "10.0.0.5", protocol: "ICMP", length: 98, info: "Echo (ping) request" },
  { id: 15, time: "0.345678", src: "10.0.0.5", dst: "192.168.1.100", protocol: "ICMP", length: 98, info: "Echo (ping) reply" },
]

// Correct answers for the lab
const MALICIOUS_DOMAIN = "malicious-site.com"
const LEAKED_PASSWORD = "secret123"
const SUSPICIOUS_IP = "185.199.108.153"

const labSteps = [
  {
    id: 1,
    title: "Supheli DNS Sorgusunu Bul",
    description: "Paketleri incele ve supheli bir domain adina yapilan DNS sorgusunu bul.",
    hint: "DNS protokolundeki paketlere bak. Hangi domain adi supheli gorunuyor?",
    answer: MALICIOUS_DOMAIN,
    field: "domain"
  },
  {
    id: 2,
    title: "Sizdirilmis Sifreyi Bul",
    description: "HTTP trafiiginde acik metin olarak gonderilen sifreyi bul.",
    hint: "HTTP GET istegine bak. URL parametrelerinde sifre var mi?",
    answer: LEAKED_PASSWORD,
    field: "password"
  },
  {
    id: 3,
    title: "Zararli Sunucu IP'sini Belirle",
    description: "Supheli domain'in cozumlendigi IP adresini bul.",
    hint: "DNS response paketine bak. Domain hangi IP'ye cozumleniyor?",
    answer: SUSPICIOUS_IP,
    field: "ip"
  }
]

export function NetworkAnalysisLab({ isOpen, onClose }: NetworkAnalysisLabProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [selectedPacket, setSelectedPacket] = useState<number | null>(null)
  const [filter, setFilter] = useState("")
  const [answers, setAnswers] = useState({ domain: "", password: "", ip: "" })
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showHint, setShowHint] = useState<number | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isOpen, startTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const filteredPackets = networkPackets.filter(packet => {
    if (!filter) return true
    const searchLower = filter.toLowerCase()
    return (
      packet.protocol.toLowerCase().includes(searchLower) ||
      packet.src.includes(filter) ||
      packet.dst.includes(filter) ||
      packet.info.toLowerCase().includes(searchLower)
    )
  })

  const checkAnswer = (stepId: number, field: string, correctAnswer: string) => {
    if (answers[field as keyof typeof answers].toLowerCase() === correctAnswer.toLowerCase()) {
      if (!completedSteps.includes(stepId)) {
        setCompletedSteps(prev => [...prev, stepId])
      }
      return true
    }
    return false
  }

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case "TCP": return "text-cyber-blue"
      case "HTTP": return "text-cyber-green"
      case "DNS": return "text-cyber-purple"
      case "ARP": return "text-yellow-400"
      case "ICMP": return "text-cyan-400"
      default: return "text-foreground"
    }
  }

  const isLabComplete = completedSteps.length === labSteps.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`bg-cyber-dark border border-cyber-purple/30 rounded-xl shadow-2xl shadow-cyber-purple/20 flex flex-col transition-all duration-300 ${
        isMaximized ? "w-full h-full" : "w-full max-w-7xl h-[90vh]"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-cyber-gray/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
              <button onClick={() => setIsMaximized(false)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
              <button onClick={() => setIsMaximized(true)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyber-purple" />
              <span className="text-sm font-mono text-foreground">Ag Analizi Lab - Wireshark Simulasyonu</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-cyber-blue">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-cyber-green" />
              <span className="text-cyber-green font-semibold">{completedSteps.length}/{labSteps.length}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Packet List */}
          <div className="flex-1 flex flex-col border-r border-border/50">
            {/* Filter Bar */}
            <div className="p-3 border-b border-border/50 bg-cyber-gray/30">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filtre: tcp, http, dns, ip adresi..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 bg-cyber-dark/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cyber-purple/50"
                />
                <Button size="sm" variant="outline" onClick={() => setFilter("")}>
                  Temizle
                </Button>
              </div>
            </div>

            {/* Packet Table Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-cyber-gray/50 text-xs font-semibold text-muted-foreground border-b border-border/50">
              <div className="col-span-1">No</div>
              <div className="col-span-2">Zaman</div>
              <div className="col-span-2">Kaynak</div>
              <div className="col-span-2">Hedef</div>
              <div className="col-span-1">Protokol</div>
              <div className="col-span-1">Uzunluk</div>
              <div className="col-span-3">Bilgi</div>
            </div>

            {/* Packet List */}
            <div className="flex-1 overflow-y-auto">
              {filteredPackets.map((packet) => (
                <div
                  key={packet.id}
                  onClick={() => setSelectedPacket(packet.id)}
                  className={`grid grid-cols-12 gap-2 px-3 py-1.5 text-xs font-mono cursor-pointer border-b border-border/20 transition-colors ${
                    selectedPacket === packet.id 
                      ? "bg-cyber-purple/20 border-cyber-purple/50" 
                      : "hover:bg-cyber-gray/30"
                  } ${packet.info.includes("malicious") || packet.info.includes("secret") || packet.info.includes("Port Scan") ? "bg-red-500/10" : ""}`}
                >
                  <div className="col-span-1 text-muted-foreground">{packet.id}</div>
                  <div className="col-span-2 text-cyber-blue">{packet.time}</div>
                  <div className="col-span-2">{packet.src}</div>
                  <div className="col-span-2">{packet.dst}</div>
                  <div className={`col-span-1 font-semibold ${getProtocolColor(packet.protocol)}`}>{packet.protocol}</div>
                  <div className="col-span-1 text-muted-foreground">{packet.length}</div>
                  <div className="col-span-3 truncate">{packet.info}</div>
                </div>
              ))}
            </div>

            {/* Packet Details */}
            {selectedPacket && (
              <div className="h-32 border-t border-border/50 bg-cyber-gray/30 p-3 overflow-y-auto">
                <h4 className="text-xs font-semibold text-cyber-blue mb-2 flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  Paket Detayi #{selectedPacket}
                </h4>
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {networkPackets.find(p => p.id === selectedPacket)?.info}
                </pre>
              </div>
            )}
          </div>

          {/* Task Panel */}
          <div className="w-80 flex flex-col bg-cyber-gray/20">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-cyber-purple" />
                Gorevler
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ag trafiigini analiz et ve supheli aktiviteleri bul
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {labSteps.map((step) => {
                const isComplete = completedSteps.includes(step.id)
                return (
                  <div key={step.id} className={`p-4 rounded-xl border transition-all ${
                    isComplete 
                      ? "bg-cyber-green/10 border-cyber-green/50" 
                      : "bg-cyber-dark/50 border-border/50"
                  }`}>
                    <div className="flex items-start gap-3 mb-2">
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`font-medium text-sm ${isComplete ? "text-cyber-green" : "text-foreground"}`}>
                          {step.id}. {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>

                    {!isComplete && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-cyber-blue hover:text-cyber-blue/80 mb-2"
                          onClick={() => setShowHint(showHint === step.id ? null : step.id)}
                        >
                          <Lightbulb className="w-3 h-3 mr-1" />
                          {showHint === step.id ? "Ipucunu Gizle" : "Ipucu"}
                        </Button>

                        {showHint === step.id && (
                          <p className="text-xs text-cyber-blue/70 bg-cyber-blue/10 p-2 rounded-lg mb-2">
                            {step.hint}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Cevabini yaz..."
                            value={answers[step.field as keyof typeof answers]}
                            onChange={(e) => setAnswers(prev => ({ ...prev, [step.field]: e.target.value }))}
                            className="flex-1 bg-cyber-dark border border-border/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cyber-purple/50"
                          />
                          <Button
                            size="sm"
                            onClick={() => checkAnswer(step.id, step.field, step.answer)}
                            className="bg-cyber-purple hover:bg-cyber-purple/80"
                          >
                            Kontrol
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Completion */}
            {isLabComplete && (
              <div className="p-4 border-t border-border/50 bg-cyber-green/10">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-cyber-green" />
                  <span className="font-semibold text-cyber-green">Lab Tamamlandi!</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Sure: {formatTime(elapsedTime)} | XP: +150
                </p>
                <Button
                  onClick={() => setShowCertificate(true)}
                  className="w-full bg-gradient-to-r from-cyber-green to-emerald-500 hover:opacity-90 text-cyber-dark font-semibold"
                >
                  Sertifikani Al
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        labName="Ag Analizi"
        userName="Ogrenci"
        completionDate={new Date().toLocaleDateString('tr-TR')}
      />
    </div>
  )
}
