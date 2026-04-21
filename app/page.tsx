"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MissionVision } from "@/components/mission-vision"
import { CurriculumSection } from "@/components/curriculum-section"
import { LabsShowcase } from "@/components/labs-showcase"
import { FeaturesSection } from "@/components/features-section"
import { LeaderboardSection } from "@/components/leaderboard-section"
import { CTFChallenge } from "@/components/ctf-challenge"
import { Footer } from "@/components/footer"
import { TerminalPanel } from "@/components/terminal-panel"
import { DemoMode } from "@/components/demo-mode"
import { PasswordCrackerLab } from "@/components/password-cracker-lab"
import { NetworkAnalysisLab } from "@/components/network-analysis-lab"
import { SQLInjectionLab } from "@/components/sql-injection-lab"
import { LinuxPrivescLab } from "@/components/linux-privesc-lab"
import { PartnersSection } from "@/components/partners-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { AchievementsSection } from "@/components/achievements-section"

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isPasswordLabOpen, setIsPasswordLabOpen] = useState(false)
  const [isNetworkLabOpen, setIsNetworkLabOpen] = useState(false)
  const [isSQLLabOpen, setIsSQLLabOpen] = useState(false)
  const [isLinuxLabOpen, setIsLinuxLabOpen] = useState(false)

  return (
    <>
      <main className={`min-h-screen bg-background overflow-x-hidden transition-all duration-300 ${isTerminalOpen ? "mr-0 md:mr-[50%] lg:mr-[40%]" : ""}`}>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-gray via-cyber-dark to-cyber-dark -z-10" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMzAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmg0djJoMnY0aC0ydjJoLTR2LTJ6bTAtMTBoLTJ2LTJoMnYyem0xMCAwaDJ2MmgtMnYtMnptLTEwIDEwdi0yaDJ2MmgtMnptMTAtMTBoMnYyaC0ydi0yen0iLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 -z-10" />

        <Navbar onOpenDemo={() => setIsDemoOpen(true)} />
        <HeroSection />
        <MissionVision />
        <CurriculumSection />
        <LabsShowcase 
          onOpenTerminal={() => setIsTerminalOpen(true)} 
          onOpenPasswordLab={() => setIsPasswordLabOpen(true)} 
          onOpenNetworkLab={() => setIsNetworkLabOpen(true)}
          onOpenSQLLab={() => setIsSQLLabOpen(true)}
          onOpenLinuxLab={() => setIsLinuxLabOpen(true)}
        />
        <FeaturesSection />
        <CTFChallenge />
        <AchievementsSection />
        <LeaderboardSection />
        <TestimonialsSection />
        <PartnersSection />
        <Footer />
      </main>

      <TerminalPanel isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <DemoMode isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <PasswordCrackerLab isOpen={isPasswordLabOpen} onClose={() => setIsPasswordLabOpen(false)} />
      <NetworkAnalysisLab isOpen={isNetworkLabOpen} onClose={() => setIsNetworkLabOpen(false)} />
      <SQLInjectionLab isOpen={isSQLLabOpen} onClose={() => setIsSQLLabOpen(false)} />
      <LinuxPrivescLab isOpen={isLinuxLabOpen} onClose={() => setIsLinuxLabOpen(false)} />
    </>
  )
}
