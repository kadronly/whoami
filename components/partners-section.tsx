"use client"

import { Building2, Users, Award } from "lucide-react"

const partners = [
  { name: "Istanbul Teknik Universitesi", logo: "ITU", type: "Universite" },
  { name: "Bogazici Universitesi", logo: "BU", type: "Universite" },
  { name: "Galatasaray Universitesi", logo: "GSU", type: "Universite" },
  { name: "Harita Muhendisligi Okulu", logo: "HMO", type: "Universite" },
  { name: "Turk Telekom", logo: "TT", type: "Kurumsal" },
  { name: "Bilgi Islem Dairesi", logo: "BID", type: "Kurumsal" },
]

export function PartnersSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 mb-4">
            <Award className="w-4 h-4 text-cyber-purple" />
            <span className="text-sm text-cyber-purple font-medium">İş Ortakları</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Güvenilen <span className="text-gradient">Kurumlar</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 flex flex-col items-center justify-center text-center group hover:border-cyber-purple/50 transition-all border border-cyber-blue/10"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">{partner.logo}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{partner.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{partner.type}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: Building2, label: "50+", title: "Universite" },
            { icon: Users, label: "10K+", title: "Aktif Kullanici" },
            { icon: Award, label: "100%", title: "Memnuniyet" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-8 h-8 text-cyber-green mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">{stat.label}</p>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
