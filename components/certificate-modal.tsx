"use client"

import { useRef } from "react"
import { X, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  labName: string
  userName: string
  completionDate: string
}

export function CertificateModal({
  isOpen,
  onClose,
  labName,
  userName,
  completionDate,
}: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const downloadCertificate = () => {
    const element = certificateRef.current
    if (!element) return

    // Simple screenshot-to-image functionality
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 1200
    canvas.height = 800

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#0a0e27")
    gradient.addColorStop(1, "#1a1f3a")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#00d4ff"
    ctx.lineWidth = 4
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    // Title
    ctx.fillStyle = "#00d4ff"
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SİBER GÜVENLİK SERTİFİKASI", canvas.width / 2, 120)

    ctx.fillStyle = "#00ff88"
    ctx.font = "bold 36px Arial"
    ctx.fillText(labName, canvas.width / 2, 220)

    ctx.fillStyle = "#ffffff"
    ctx.font = "24px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Başarıyla Tamamlayan:", 100, 350)
    ctx.font = "bold 32px Arial"
    ctx.fillStyle = "#00ff88"
    ctx.fillText(userName, 100, 400)

    ctx.fillStyle = "#a0a0a0"
    ctx.font = "16px Arial"
    ctx.fillText(`Tamamlanma Tarihi: ${completionDate}`, 100, 600)

    ctx.fillStyle = "#00d4ff"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Whoami Siber Güvenlik Eğitim Platformu", canvas.width / 2, 700)

    // Download
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `${userName}-${labName}-sertifika.png`
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>

        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-purple/20 border-4 border-cyber-blue rounded-xl p-12 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyber-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyber-blue/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-cyber-blue mb-2">SİBER GÜVENLİK SERTİFİKASI</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-cyber-green to-cyber-blue mx-auto mb-8" />

            <p className="text-muted-foreground mb-4">Bu belge, aşağıdaki kişinin başarıyla tamamladığını onaylar:</p>

            <h2 className="text-3xl font-bold text-cyber-green mb-8">{labName}</h2>

            <div className="mb-12 p-6 border-2 border-cyber-blue/30 rounded-lg">
              <p className="text-muted-foreground mb-2">Başarıyla Tamamlayan</p>
              <p className="text-2xl font-bold text-foreground">{userName}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Tamamlanma Tarihi</p>
                <p className="text-lg font-semibold text-cyber-blue">{completionDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Durum</p>
                <p className="text-lg font-semibold text-cyber-green">✓ Başarılı</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Whoami Siber Güvenlik Eğitim Platformu
            </p>
            <p className="text-xs text-muted-foreground">
              Bu sertifika, kullanıcının interaktif labs aracılığıyla edindiği siber güvenlik bilgisini kanıtlar.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <Button
            onClick={downloadCertificate}
            className="bg-cyber-green hover:bg-cyber-green/90 text-cyber-dark font-semibold gap-2"
          >
            <Download className="w-4 h-4" />
            Sertifika İndir (PNG)
          </Button>
          <Button
            variant="outline"
            className="border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/10 gap-2"
          >
            <Share2 className="w-4 h-4" />
            Paylaş
          </Button>
        </div>
      </div>
    </div>
  )
}
