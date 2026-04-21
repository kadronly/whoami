"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Password validation for cybersecurity standards
const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Sifre en az 8 karakter olmali" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Sifre en az bir kucuk harf icermeli" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Sifre en az bir buyuk harf icermeli" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Sifre en az bir rakam icermeli" }
  }
  return { valid: true, message: "" }
}

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ hasLower: false, hasUpper: false, hasNumber: false, hasLength: false })
  const router = useRouter()

  // Real-time password strength checker
  const checkPasswordStrength = (pass: string) => {
    setPasswordStrength({
      hasLength: pass.length >= 8,
      hasLower: /[a-z]/.test(pass),
      hasUpper: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate password
    const passwordCheck = validatePassword(password)
    if (!passwordCheck.valid) {
      setError(passwordCheck.message)
      setLoading(false)
      return
    }

    // Validate username
    if (username.length < 3) {
      setError("Kullanici adi en az 3 karakter olmali")
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: {
          username: username,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 border border-cyber-green/30 text-center">
            <div className="w-16 h-16 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-cyber-green" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Kayit Basarili!</h1>
            <p className="text-muted-foreground mb-6">
              E-posta adresinize bir dogrulama linki gonderdik. Lutfen e-postanizi kontrol edin ve hesabinizi aktif edin.
            </p>
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple">
                Ana Sayfaya Don
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyber-blue mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>

        <div className="glass-effect rounded-2xl p-8 border border-cyber-blue/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyber-blue" />
                <div className="absolute inset-0 bg-cyber-blue/20 blur-xl" />
              </div>
              <span className="text-2xl font-bold text-foreground">Whoami</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Hesap Olustur</h1>
            <p className="text-muted-foreground text-sm mt-1">Siber guvenlik yolculuguna basla</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Kullanici Adi</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="CyberNinja_42"
                  required
                  className="pl-10 bg-cyber-dark/50 border-border/50 focus:border-cyber-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  className="pl-10 bg-cyber-dark/50 border-border/50 focus:border-cyber-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Sifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    checkPasswordStrength(e.target.value)
                  }}
                  placeholder="Guclu bir sifre olusturun"
                  required
                  className="pl-10 bg-cyber-dark/50 border-border/50 focus:border-cyber-blue"
                />
              </div>
              {/* Password strength indicators */}
              {password && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">Sifre gereksinimleri:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasLength ? "text-cyber-green" : "text-muted-foreground"}`}>
                      {passwordStrength.hasLength ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      En az 8 karakter
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasLower ? "text-cyber-green" : "text-muted-foreground"}`}>
                      {passwordStrength.hasLower ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      Kucuk harf (a-z)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasUpper ? "text-cyber-green" : "text-muted-foreground"}`}>
                      {passwordStrength.hasUpper ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      Buyuk harf (A-Z)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? "text-cyber-green" : "text-muted-foreground"}`}>
                      {passwordStrength.hasNumber ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      Rakam (0-9)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:opacity-90 text-white font-semibold py-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kayit Yapiliyor...
                </div>
              ) : (
                "Kayit Ol"
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            Zaten hesabin var mi?{" "}
            <Link href="/auth/giris" className="text-cyber-blue hover:underline">
              Giris Yap
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl font-bold text-cyber-blue">50+</div>
            <div className="text-xs text-muted-foreground">Lab</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-cyber-purple">12</div>
            <div className="text-xs text-muted-foreground">Rozet</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-cyber-green">10K+</div>
            <div className="text-xs text-muted-foreground">Ogrenci</div>
          </div>
        </div>
      </div>
    </div>
  )
}
