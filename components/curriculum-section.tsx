"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Lock, CheckCircle2, Clock, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopicDetail {
  title: string
  description: string
}

interface CurriculumWeek {
  week: number
  title: string
  description: string
  topics: TopicDetail[]
  difficulty: string
  duration: string
  status: string
}

const curriculum: CurriculumWeek[] = [
  {
    week: 1,
    title: "Siber Güvenliğe Giriş",
    description: "Temel kavramlar, siber tehditler ve dijital güvenlik farkındalığı",
    topics: [
      {
        title: "Siber güvenlik nedir?",
        description: "Siber güvenlik, bilgisayar sistemlerini, ağları ve verileri dijital saldırılardan, yetkisiz erişimden ve hasardan koruma pratiğidir. Gizlilik, bütünlük ve erişilebilirlik (CIA üçlüsü) temel prensiplerini içerir. Günümüzde dijital dönüşümle birlikte siber güvenlik hem bireyler hem de kurumlar için kritik önem taşımaktadır."
      },
      {
        title: "Yaygın tehdit türleri",
        description: "Malware (zararlı yazılım), phishing (oltalama), ransomware (fidye yazılımı), DDoS saldırıları, man-in-the-middle saldırıları ve zero-day açıkları en yaygın siber tehditlerdir. Her tehdit türünün kendine özgü çalışma mekanizması ve korunma yöntemleri vardır. Bu tehditleri tanımak, onlara karşı savunma geliştirmenin ilk adımıdır."
      },
      {
        title: "Güvenli şifre oluşturma",
        description: "Güçlü bir şifre en az 12 karakter uzunluğunda olmalı, büyük-küçük harf, rakam ve özel karakterler içermelidir. Kişisel bilgiler (doğum tarihi, isim) kullanılmamalıdır. Parola yöneticileri kullanmak ve iki faktörlü kimlik doğrulama (2FA) aktifleştirmek güvenliği önemli ölçüde artırır."
      },
      {
        title: "Sosyal mühendislik",
        description: "Sosyal mühendislik, insanları manipüle ederek gizli bilgileri ele geçirme tekniğidir. Phishing e-postaları, telefon dolandırıcılığı (vishing), SMS dolandırıcılığı (smishing) ve pretexting yaygın yöntemlerdir. İnsan faktörü genellikle güvenlik zincirinin en zayıf halkasıdır, bu nedenle farkındalık eğitimi kritik öneme sahiptir."
      }
    ],
    difficulty: "Başlangıç",
    duration: "2 saat",
    status: "completed",
  },
  {
    week: 2,
    title: "Ağ Temelleri",
    description: "IP adresleri, protokoller ve ağ mimarisi",
    topics: [
      {
        title: "TCP/IP modeli",
        description: "TCP/IP modeli internetin temelini oluşturan 4 katmanlı bir protokol yığınıdır: Uygulama, Taşıma, İnternet ve Ağ Erişim katmanları. TCP güvenilir veri iletimi sağlarken, IP paketlerin yönlendirilmesinden sorumludur. Bu modeli anlamak, ağ güvenliğinin temelini kavramak için zorunludur."
      },
      {
        title: "DNS ve DHCP",
        description: "DNS (Domain Name System) alan adlarını IP adreslerine çevirir, internette 'telefon rehberi' görevi görür. DHCP (Dynamic Host Configuration Protocol) ağdaki cihazlara otomatik IP adresi atar. DNS spoofing ve DHCP saldırıları yaygın güvenlik tehditleridir, bu protokollerin güvenliği kritik öneme sahiptir."
      },
      {
        title: "Port kavramı",
        description: "Portlar, ağ üzerinde belirli servislere erişim noktalarıdır (0-65535 arası). HTTP 80, HTTPS 443, SSH 22, FTP 21 gibi well-known portlar vardır. Port tarama, güvenlik değerlendirmesinin önemli bir parçasıdır. Gereksiz açık portlar güvenlik riski oluşturur ve kapatılmalıdır."
      },
      {
        title: "Wireshark kullanımı",
        description: "Wireshark, ağ trafiğini yakalayıp analiz eden güçlü bir araçtır. Paket filtreleme, protokol analizi ve şüpheli trafik tespiti için kullanılır. Ağ sorunlarını teşhis etmek ve güvenlik olaylarını incelemek için vazgeçilmez bir araçtır. Etik kullanım ve yasal sınırlar önemlidir."
      }
    ],
    difficulty: "Başlangıç",
    duration: "3 saat",
    status: "completed",
  },
  {
    week: 3,
    title: "İşletim Sistemi Güvenliği",
    description: "Windows ve Linux güvenlik yapılandırması",
    topics: [
      {
        title: "Dosya izinleri",
        description: "Linux'ta chmod, chown komutlarıyla dosya izinleri yönetilir (rwx - read, write, execute). Windows'ta NTFS izinleri ve ACL (Access Control List) kullanılır. En az yetki prensibi (least privilege) uygulanmalı, hassas dosyalar korunmalıdır. Yanlış yapılandırılmış izinler ciddi güvenlik açıklarına yol açabilir."
      },
      {
        title: "Kullanıcı yönetimi",
        description: "Kullanıcı hesapları, gruplar ve roller doğru yapılandırılmalıdır. Root/Administrator hesabı günlük kullanımda tercih edilmemelidir. Güçlü parola politikaları, hesap kilitleme ve düzenli denetim önemlidir. PAM (Linux) ve Active Directory (Windows) kullanıcı yönetiminin temel araçlarıdır."
      },
      {
        title: "Güvenlik duvarı",
        description: "Güvenlik duvarı (firewall) gelen ve giden ağ trafiğini kontrol eder. Linux'ta iptables/nftables/ufw, Windows'ta Windows Defender Firewall kullanılır. Varsayılan olarak tümünü reddet (deny all) politikası uygulanmalı, sadece gerekli portlar açılmalıdır. Stateful ve stateless firewall farkları önemlidir."
      },
      {
        title: "Log analizi",
        description: "Sistem logları güvenlik olaylarının tespiti için kritiktir. Linux'ta /var/log dizini, Windows'ta Event Viewer kullanılır. Başarısız giriş denemeleri, yetkisiz erişim ve sistem değişiklikleri izlenmelidir. SIEM araçları log toplama ve analizi için kullanılır. Düzenli log incelemesi güvenlik ihlallerinin erken tespitini sağlar."
      }
    ],
    difficulty: "Orta",
    duration: "3 saat",
    status: "current",
  },
  {
    week: 4,
    title: "Kriptografi Temelleri",
    description: "Şifreleme, hash fonksiyonları ve dijital imzalar",
    topics: [
      {
        title: "Simetrik şifreleme",
        description: "Aynı anahtarın hem şifreleme hem de çözme için kullanıldığı yöntemdir. AES (Advanced Encryption Standard) en yaygın kullanılan algoritmadır. Hızlıdır ancak anahtar dağıtımı problemi vardır. Blok şifreleme modları (CBC, GCM) ve akış şifreleri farklı kullanım senaryoları için uygundur."
      },
      {
        title: "Asimetrik şifreleme",
        description: "Açık anahtar (public key) ve özel anahtar (private key) çifti kullanılır. RSA ve ECC en bilinen algoritmalardır. Anahtar değişimi ve dijital imzalar için idealdir. Simetrik şifrelemeye göre yavaştır, genellikle hibrit sistemlerde kullanılır."
      },
      {
        title: "Hash algoritmaları",
        description: "Hash fonksiyonları sabit uzunlukta özet değer üretir. SHA-256, SHA-3 güvenli algoritmalar, MD5 ve SHA-1 artık güvensiz kabul edilir. Parola saklama (salt ile birlikte), veri bütünlüğü doğrulama ve dijital imzalarda kullanılır. Tek yönlüdür, geri döndürülemez."
      },
      {
        title: "SSL/TLS",
        description: "İnternet üzerinde güvenli iletişim sağlayan protokollerdir. HTTPS'in temelini oluşturur. Sertifika otoriteleri (CA), handshake süreci ve şifre takımları (cipher suites) önemli kavramlardır. TLS 1.3 güncel ve güvenli sürümdür, eski sürümler kullanılmamalıdır."
      }
    ],
    difficulty: "Orta",
    duration: "3 saat",
    status: "locked",
  },
  {
    week: 5,
    title: "Web Güvenliği",
    description: "OWASP Top 10 ve web uygulama güvenliği",
    topics: [
      {
        title: "SQL Injection",
        description: "Kullanıcı girdileri aracılığıyla veritabanına zararlı SQL komutları enjekte etme saldırısıdır. Prepared statements ve parametreli sorgular ile önlenir. Union-based, blind ve time-based SQL injection türleri vardır. OWASP Top 10'da en kritik güvenlik açıklarından biridir."
      },
      {
        title: "XSS saldırıları",
        description: "Cross-Site Scripting, web sayfalarına zararlı JavaScript kodu enjekte etme saldırısıdır. Stored, Reflected ve DOM-based XSS türleri vardır. Input validation, output encoding ve Content Security Policy (CSP) ile korunulur. Çerez hırsızlığı ve session hijacking için kullanılabilir."
      },
      {
        title: "CSRF",
        description: "Cross-Site Request Forgery, kullanıcının tarayıcısını kullanarak onun adına yetkisiz istekler gönderme saldırısıdır. Anti-CSRF token'ları, SameSite cookie attribute ve Referer header kontrolü ile önlenir. Kullanıcı farkında olmadan işlem yapmasına neden olabilir."
      },
      {
        title: "Güvenli kodlama",
        description: "Input validation, output encoding, authentication ve authorization kontrolleri temel prensiplerdir. Defense in depth yaklaşımı benimsenmelidir. OWASP Secure Coding Guidelines takip edilmeli, düzenli kod incelemesi ve güvenlik testleri yapılmalıdır. Güvenlik, geliştirme sürecinin başından itibaren düşünülmelidir."
      }
    ],
    difficulty: "Orta",
    duration: "4 saat",
    status: "locked",
  },
  {
    week: 6,
    title: "Etik Hacking Temelleri",
    description: "Penetrasyon testi metodolojisi ve araçları",
    topics: [
      {
        title: "Keşif teknikleri",
        description: "Pasif keşif (OSINT, whois, DNS sorguları) ve aktif keşif (port tarama, banner grabbing) teknikleri kullanılır. Hedef hakkında bilgi toplama penetrasyon testinin ilk ve en önemli aşamasıdır. Shodan, theHarvester, Maltego yaygın kullanılan araçlardır."
      },
      {
        title: "Nmap kullanımı",
        description: "Nmap (Network Mapper) en güçlü port tarama ve ağ keşif aracıdır. SYN scan, TCP connect, UDP scan gibi tarama türleri vardır. NSE (Nmap Scripting Engine) ile zafiyet tespiti yapılabilir. -sV servis versiyon tespiti, -O işletim sistemi tespiti sağlar."
      },
      {
        title: "Zafiyet tarama",
        description: "Sistemlerdeki güvenlik açıklarını tespit etme sürecidir. Nessus, OpenVAS, Nikto yaygın kullanılan araçlardır. CVE (Common Vulnerabilities and Exposures) veritabanı zafiyet bilgilerini içerir. Düzenli zafiyet taraması güvenlik yönetiminin önemli bir parçasıdır."
      },
      {
        title: "Metasploit giriş",
        description: "Penetrasyon testi için kullanılan güçlü bir framework'tür. Exploit'ler, payload'lar ve auxiliary modüller içerir. Msfconsole temel arayüzüdür. Meterpreter güçlü bir post-exploitation aracıdır. Sadece yetkili sistemlerde ve etik kurallara uygun kullanılmalıdır."
      }
    ],
    difficulty: "İleri",
    duration: "4 saat",
    status: "locked",
  },
]

export function CurriculumSection() {
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [expandedTopics, setExpandedTopics] = useState<number[]>([])

  const toggleTopic = (index: number) => {
    setExpandedTopics(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-cyber-green" />
      case "current":
        return <div className="w-5 h-5 rounded-full border-2 border-cyber-blue animate-pulse bg-cyber-blue/20" />
      default:
        return <Lock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Başlangıç":
        return "text-cyber-green bg-cyber-green/10"
      case "Orta":
        return "text-cyber-blue bg-cyber-blue/10"
      case "İleri":
        return "text-cyber-purple bg-cyber-purple/10"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <section id="mufredat" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-effect text-cyber-purple text-sm font-medium mb-4">
            12 Haftalık Program
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Müfredat</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MEB müfredatına uyumlu, adım adım ilerleyen kapsamlı eğitim programı
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-3">
            {curriculum.map((week, index) => (
              <button
                key={index}
                onClick={() => {
                  if (week.status !== "locked") {
                    setSelectedWeek(index)
                    setExpandedTopics([])
                  }
                }}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 group ${
                  selectedWeek === index
                    ? "glass-effect border border-cyber-blue/50"
                    : week.status === "locked"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-cyber-gray/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    selectedWeek === index
                      ? "bg-gradient-to-r from-cyber-blue to-cyber-purple text-cyber-dark"
                      : "bg-cyber-gray text-muted-foreground"
                  }`}
                >
                  {week.week}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium truncate ${selectedWeek === index ? "text-cyber-blue" : "text-foreground"}`}
                  >
                    {week.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{week.duration}</p>
                </div>
                {getStatusIcon(week.status)}
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl p-8 border border-cyber-blue/20 h-full">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-cyber-blue font-medium">Hafta {curriculum[selectedWeek].week}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(curriculum[selectedWeek].difficulty)}`}
                    >
                      {curriculum[selectedWeek].difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{curriculum[selectedWeek].title}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {curriculum[selectedWeek].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {curriculum[selectedWeek].topics.length} Konu
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-8">{curriculum[selectedWeek].description}</p>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyber-purple" />
                  Bu Haftanın Konuları
                  <span className="text-xs text-muted-foreground font-normal">(detay için tıklayın)</span>
                </h4>
                <div className="space-y-3">
                  {curriculum[selectedWeek].topics.map((topic, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-cyber-dark/50 border border-cyber-blue/10 hover:border-cyber-blue/30 transition-all duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleTopic(i)}
                        className="w-full flex items-center gap-3 p-4 text-left group"
                      >
                        <div className={`transition-transform duration-300 ${expandedTopics.includes(i) ? "rotate-90" : ""}`}>
                          <ChevronRight className="w-4 h-4 text-cyber-blue" />
                        </div>
                        <span className="text-sm text-foreground font-medium flex-1">{topic.title}</span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedTopics.includes(i) ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedTopics.includes(i) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-7 border-l-2 border-cyber-blue/30">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-cyber-dark font-semibold">
                  {curriculum[selectedWeek].status === "completed" ? "Tekrar Et" : "Derse Başla"}
                </Button>
                <Button
                  variant="outline"
                  className="border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/10 bg-transparent"
                >
                  Lab&apos;a Git
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
