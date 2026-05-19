'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Upload, LayoutGrid, LogOut, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import { useT } from '@/hooks/use-t';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import toast from 'react-hot-toast';

export function AppNavbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const T = useT();

  const navLinks = [
    { href: '/dashboard', label: T.nav.dashboard, icon: LayoutGrid },
    { href: '/feed', label: T.nav.explore, icon: LayoutGrid },
    { href: '/upload', label: T.nav.rateFit, icon: Upload },
  ];

  async function handleLogout() {
    await logout();
    toast.success(T.common.logout);
    router.push('/');
  }

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 flex items-center justify-between px-6 h-16"
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-black text-white hidden sm:block">RateMyOutfit</span>
      </Link>

      <div className="flex items-center gap-1">
        {navLinks.map((link) => (
          <Button key={link.href} variant="ghost" size="sm" asChild>
            <Link href={link.href} className="text-white/60 hover:text-white">
              {link.href === '/upload' ? (
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg px-3 py-1 text-xs font-bold">
                  + {link.label}
                </span>
              ) : (
                link.label
              )}
            </Link>
          </Button>
        ))}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leaderboard" className="text-white/60 hover:text-white">
            <Trophy className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {user && (
          <Link href={`/profile/${user.username}`}>
            <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-purple-500/30 hover:ring-purple-500/60 transition-all">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>
                {(user.displayName || user.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/30 hover:text-white/60">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </motion.nav>
  );
}
