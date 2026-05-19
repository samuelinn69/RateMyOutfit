'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';
import { useT } from '@/hooks/use-t';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const T = useT();

  const [form, setForm] = useState({ email: '', username: '', password: '', displayName: '' });
  const [showPassword, setShowPassword] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(form);
      toast.success(T.register.toastSuccess);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || T.register.toastError);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl relative z-10 grid md:grid-cols-2 gap-12 items-center py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-white">RateMyOutfit</span>
          </Link>

          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            {T.register.headline1}
            <br />
            <span className="gradient-text">{T.register.headline2}</span>
          </h1>
          <p className="text-white/40 text-lg mb-8">{T.register.sub}</p>

          <ul className="space-y-3">
            {T.register.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/60">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="md:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-white">RateMyOutfit</span>
            </Link>
          </div>

          <h2 className="text-2xl font-black text-white mb-6 md:text-left text-center">
            {T.register.formTitle}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">{T.register.displayName}</Label>
              <Input
                placeholder={T.register.displayName}
                value={form.displayName}
                onChange={(e) => update('displayName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">{T.register.username}</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                <Input
                  placeholder="yourhandle"
                  value={form.username}
                  onChange={(e) => update('username', e.target.value.toLowerCase())}
                  required
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">{T.register.email}</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">{T.register.password}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={T.register.passwordPlaceholder}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {T.register.submit}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <p className="text-white/20 text-xs text-center">{T.register.terms}</p>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            {T.register.hasAccount}{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              {T.register.signInLink}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
