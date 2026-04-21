"use client"

import { Gamepad2, Users, Shield, GraduationCap, Target, Award, Clock, Lightbulb } from "lucide-react"

const features = [
  {
    icon: GraduationCap,
    title: "Müfredata Uyumlu",
    description: "MEB bilişim dersleriyle entegre edilmiş, sınıf içi kullanıma uygun içerikler",
    color: "from-cyber-blue to-blue-600",
  },
  {
    icon: Gamepad2,
    title: "Oyunlaştırılmış Öğrenme",
    description: "Rozet, puan ve seviye sistemiyle motivasyonu artıran eğlenceli deneyim",
    color: "from-cyber-purple to-violet-600",
  },
  {
    icon: Target,
    title: "CTF Yarışmaları",
    description: "Haftalık mini CTF'ler ve büyük turnuvalarla rekabetçi öğrenme ortamı",
    color: "from-cyber-pink to-rose-600",
  },
  {
    icon: Shield,
    title: "Güvenli Lab Ortamı",
    description: "İzole sandbox ortamlarında gerçek araçlarla güvenli pratik imkanı",
    color: "from-cyber-green to-emerald-600",
  },
  {
    icon: Clock,
    title: "Haftalık İlerleme",
    description: "Her hafta zorlaşan görevlerle sistematik ve ölçülebilir gelişim",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Users,
    title: "Topluluk Desteği",
    description: "Akran öğrenimi, mentorluk ve canlı tartışma forumları",
    color: "from-cyan-500 to-sky-600",
  },
  {
    icon: Award,
    title: "Sertifikasyon",
    description: "Her modül sonunda kazanılan başarı belgeleri ve portfolyo oluşturma",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Lightbulb,
    title: "Kariyer Rehberliği",
    description: "Siber güvenlik kariyeri hakkında uzman tavsiyeleri ve yol haritası",
    color: "from-indigo-500 to-purple-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="ozellikler" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-effect text-cyber-pink text-sm font-medium mb-4">
            Neden whoami?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Platform Özellikleri</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Öğrencilerin ihtiyaçlarına göre tasarlanmış, kapsamlı ve modern bir eğitim deneyimi
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />
              <div className="relative glass-effect rounded-2xl p-6 h-full border border-cyber-blue/10 group-hover:border-cyber-blue/30 transition-all duration-300 group-hover:-translate-y-2">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-cyber-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 text-center border border-cyber-blue/20">
            <div className="text-4xl font-bold text-cyber-blue mb-2">%100</div>
            <p className="text-sm text-muted-foreground">Ücretsiz Erişim</p>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center border border-cyber-purple/20">
            <div className="text-4xl font-bold text-cyber-purple mb-2">7/24</div>
            <p className="text-sm text-muted-foreground">Platform Erişimi</p>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center border border-cyber-green/20">
            <div className="text-4xl font-bold text-cyber-green mb-2">Türkçe</div>
            <p className="text-sm text-muted-foreground">Tam Türkçe İçerik</p>
          </div>
        </div>
      </div>
    </section>
  )
}
