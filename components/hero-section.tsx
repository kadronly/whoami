"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Lock, Code, Zap } from "lucide-react"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const fullText = "Siber Güvenliğin Geleceğini İnşa Et"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyber-pink/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Shield className="absolute top-1/4 left-[10%] w-12 h-12 text-cyber-blue/20 animate-float" />
        <Lock
          className="absolute top-1/3 right-[15%] w-10 h-10 text-cyber-purple/20 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <Code
          className="absolute bottom-1/3 left-[20%] w-14 h-14 text-cyber-pink/20 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <Zap
          className="absolute bottom-1/4 right-[10%] w-8 h-8 text-cyber-green/20 animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8 border border-cyber-blue/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Türkiye'nin İlk Yerli ve Kurulumsuz Siber Güvenlik Laboratuvarı
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <span className="text-gradient">{typedText}</span>
            <span className="animate-pulse text-cyber-blue">|</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Lise öğrencileri için özel olarak tasarlanmış, müfredata uyumlu interaktif siber güvenlik eğitim platformu.
            <span className="text-cyber-blue"> HackTheBox</span> ve
            <span className="text-cyber-purple"> TryHackMe</span> tarzı lablarla gerçek dünya deneyimi kazan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-cyber-dark font-bold px-8 py-6 text-lg group animate-pulse-glow"
            >
              Ücretsiz Başla
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/10 px-8 py-6 text-lg group bg-transparent"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Tanıtım Videosu
            </Button>
          </div>

          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="cyber-border rounded-xl overflow-hidden shadow-2xl shadow-cyber-blue/20">
              <div className="bg-cyber-gray/80 px-4 py-3 flex items-center gap-2 border-b border-cyber-blue/20">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-muted-foreground font-mono">terminal@whoami</span>
              </div>
              <div className="bg-cyber-dark/90 p-6 font-mono text-sm">
                <div className="flex items-center gap-2 text-cyber-green mb-2">
                  <span className="text-cyber-blue">$</span>
                  <span className="text-foreground">./start_learning.sh --level=beginner</span>
                </div>
                <div className="text-muted-foreground mb-2">[*] Modül yükleniyor: Ağ Güvenliği Temelleri...</div>
                <div className="text-cyber-blue mb-2">[+] Lab ortamı hazırlanıyor...</div>
                <div className="text-cyber-green mb-2">[✓] 12 haftalık müfredat aktif</div>
                <div className="text-cyber-purple">[!] Yeni rozet kazandınız: &quot;İlk Adım&quot; 🎯</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cyber-blue/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-cyber-blue rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
