"use client"

import { Target, Eye, Sparkles, Heart } from "lucide-react"

export function MissionVision() {
  return (
    <section id="misyon" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-effect text-cyber-blue text-sm font-medium mb-4">
            Bizi Tanıyın
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Misyon & Vizyon</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Türkiye&apos;nin geleceğini siber tehditlere karşı koruyacak genç yetenekleri yetiştiriyoruz
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative glass-effect rounded-2xl p-8 h-full border border-cyber-blue/20 group-hover:border-cyber-blue/40 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple">
                  <Target className="w-8 h-8 text-cyber-dark" />
                </div>
                <h3 className="text-2xl font-bold text-cyber-blue">Misyonumuz</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lise çağındaki gençlere, ulusal müfredata entegre edilmiş, pratiğe dayalı ve eğlenceli bir siber
                güvenlik eğitimi sunarak dijital dünyada bilinçli ve güvenli bireyler yetiştirmek.
              </p>
              <ul className="space-y-3">
                {[
                  "Müfredata uyumlu içerik tasarımı",
                  "Uygulamalı lab ortamları",
                  "Oyunlaştırılmış öğrenme deneyimi",
                  "Kariyer rehberliği ve mentorluk",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-cyber-blue flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative glass-effect rounded-2xl p-8 h-full border border-cyber-purple/20 group-hover:border-cyber-purple/40 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-pink">
                  <Eye className="w-8 h-8 text-cyber-dark" />
                </div>
                <h3 className="text-2xl font-bold text-cyber-purple">Vizyonumuz</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Türkiye&apos;de lise düzeyinde siber güvenlik eğitiminin öncüsü olarak, uluslararası standartlarda
                yetişmiş, etik değerlere sahip siber güvenlik uzmanları yetiştiren referans platform olmak.
              </p>
              <ul className="space-y-3">
                {[
                  "Türkiye'nin en kapsamlı lise seviyesi platformu",
                  "CTF yarışmalarında ulusal başarı",
                  "10.000+ aktif öğrenci hedefi",
                  "Uluslararası sertifikasyon ortaklıkları",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4 text-cyber-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 glass-effect rounded-2xl p-6 border border-cyber-blue/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple flex items-center justify-center">
                <span className="text-cyber-dark font-bold text-lg">İAÜ</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">İstanbul Aydın Üniversitesi</p>
                <p className="text-sm text-cyber-blue">Siber Güvenlik Programı</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Bu proje, İstanbul Aydın Üniversitesi, Siber Güvenlik Programı öğrencileri tarafından geliştirilmektedir.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
