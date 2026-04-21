"use client"

import Link from "next/link"
import { Shield, Terminal, Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="relative pt-24 pb-8 border-t border-border/50">
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-gray/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-4">Siber Güvenlik Dünyasından Haberdar Ol</h3>
          <p className="text-muted-foreground mb-6">
            Yeni lablar, CTF duyuruları ve eğitim içerikleri için bültenimize abone ol
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="E-posta adresin"
              className="bg-cyber-dark/50 border-cyber-blue/30 focus:border-cyber-blue"
            />
            <Button className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-cyber-dark font-semibold">
              <Send className="w-4 h-4 mr-2" />
              Abone Ol
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Shield className="w-8 h-8 text-cyber-blue" />
                <Terminal className="w-4 h-4 text-cyber-purple absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-cyber-blue">who</span>
                <span className="text-cyber-purple">am</span>
                <span className="text-cyber-pink">i</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Lise öğrencileri için tasarlanmış Türkiye&apos;nin ilk kapsamlı siber güvenlik eğitim platformu.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg glass-effect text-muted-foreground hover:text-cyber-blue transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass-effect text-muted-foreground hover:text-cyber-blue transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass-effect text-muted-foreground hover:text-cyber-purple transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass-effect text-muted-foreground hover:text-cyber-pink transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {["Müfredat", "Lablar", "CTF Yarışmaları", "Sıralama", "Rozetler"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Kaynaklar</h4>
            <ul className="space-y-3">
              {["Blog", "Dökümanlar", "Video Eğitimler", "SSS", "Destek"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-cyber-purple transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-cyber-blue" />
                info@whoamitech.net
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-cyber-purple" />
                +90 545 884 1834
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-cyber-pink flex-shrink-0 mt-0.5" />
                İstanbul Aydın Üniversitesi, Florya Kampüsü
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 whoamitech. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-cyber-blue transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="hover:text-cyber-purple transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="#" className="hover:text-cyber-pink transition-colors">
                KVKK
              </Link>
            </div>
          </div>

          
        </div>
      </div>
    </footer>
  )
}
