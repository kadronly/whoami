"use client"

import { Star, MessageSquare } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    name: "Ahmet Yilmaz",
    role: "Bilgisayar Mühendisliği Öğrencisi",
    school: "Istanbul Teknik Universitesi",
    text: "Whoami labları sayesinde MD5 hash krımanin ne kadar onemli oldugunu anladim. Gercek senaryolar ile ogreniyorum!",
    rating: 5,
  },
  {
    name: "Zeynep Kaya",
    role: "IT Güvenliği Uzmanı",
    school: "Turk Telekom",
    text: "Kurumsal egitim icin Whoami'yi tavsiye ederim. Interaktif lablar calisanlarimizin siber guvenlik farkindarlıgini onemli olcude artırmis.",
    rating: 5,
  },
  {
    name: "Murat Ozturk",
    role: "Etik Hackerı",
    school: "Siber Güvenlik Profesyoneli",
    text: "Terminal deneyimi ve hash cracking tools mukemmel. Gercek penetration testing calistirmalarindan farkı yok!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/5 via-transparent to-cyber-blue/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-pink/10 border border-cyber-pink/20 mb-4">
            <MessageSquare className="w-4 h-4 text-cyber-pink" />
            <span className="text-sm text-cyber-pink font-medium">Kullanıcı Deneyimleri</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Neler Söylüyorlar <span className="text-gradient">Whoami Hakkında</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12 border border-cyber-blue/10 min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-cyber-yellow text-cyber-yellow" />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
                "{testimonials[activeIndex].text}"
              </p>
            </div>

            <div className="border-t border-cyber-blue/10 pt-6">
              <p className="font-bold text-foreground">{testimonials[activeIndex].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</p>
              <p className="text-xs text-muted-foreground mt-1">{testimonials[activeIndex].school}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? "bg-cyber-green w-8"
                    : "bg-cyber-blue/30 hover:bg-cyber-blue/50"
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
