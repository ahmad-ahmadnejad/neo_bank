'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Menu, Search, User, Bell, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchTransactions } from '@/features/transactions/hooks/useSearchTransactions';

export function Header({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);
  const { data: searchResults = [], isLoading: isSearching } = useSearchTransactions(debouncedQuery);
  
  const [isFocused, setIsFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsFocused(false);
      router.push(`/dashboard/transactions?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-surface/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 shrink-0 shadow-sm">
      <div className="flex items-center gap-6 w-full lg:w-auto">
        <button 
          className="lg:hidden text-foreground-muted hover:text-white transition-colors shrink-0" 
          onClick={toggleMobileMenu}
        >
          <Menu className="w-7 h-7" />
        </button>
        
        {/* Search Bar - Hidden on mobile */}
        <form ref={searchRef} onSubmit={handleSearch} className="hidden md:flex flex-col relative z-50">
          <div className="flex items-center bg-background border border-white/10 rounded-2xl px-4 py-3 w-80 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-inner relative z-10">
            <button type="submit">
              <Search className="w-5 h-5 text-foreground-muted ml-3 shrink-0" />
            </button>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="جستجو در تراکنش‌ها..." 
              className="bg-transparent text-sm w-full outline-none text-white placeholder:text-foreground-muted pr-3" 
            />
          </div>

          <AnimatePresence>
            {isFocused && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-14 right-0 w-80 bg-surface-raised border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-foreground-muted">در حال جستجو...</div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map(result => (
                      <div 
                        key={result.id} 
                        onClick={() => {
                          setSearchQuery(result.description || result.category);
                          setIsFocused(false);
                          router.push(`/dashboard/transactions?q=${encodeURIComponent(result.description || result.category)}`);
                        }}
                        className="flex items-center justify-between p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                      >
                        <div className="flex flex-col overflow-hidden max-w-[150px]">
                          <span className="text-sm font-bold text-white truncate">{result.category}</span>
                          {result.description && <span className="text-xs text-foreground-muted truncate">{result.description}</span>}
                        </div>
                        <span className={result.type === 'INCOME' ? "text-emerald-400 font-mono text-sm shrink-0" : "text-rose-400 font-mono text-sm shrink-0"}>
                          {result.type === 'INCOME' ? '+' : '-'}{(result.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div 
                      onClick={() => { setIsFocused(false); router.push(`/dashboard/transactions?q=${encodeURIComponent(searchQuery)}`); }}
                      className="p-3 flex items-center justify-center gap-2 text-xs text-primary bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors"
                    >
                      مشاهده تمام نتایج
                      <ChevronLeft className="w-3 h-3" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-foreground-muted">نتیجه‌ای یافت نشد.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="flex items-center gap-5 shrink-0 relative" ref={notifRef}>
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative p-2 text-foreground-muted hover:text-white transition-colors rounded-full hover:bg-white/5"
        >
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Bell className="w-6 h-6" />
        </button>

        <AnimatePresence>
          {isNotifOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-14 left-0 w-64 bg-surface-raised border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Bell className="w-6 h-6 text-foreground-muted opacity-50" />
              </div>
              <p className="text-sm text-foreground-muted">هیچ یادآور یا اطلاعیه‌ای ندارید.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 cursor-pointer shadow-neon transition-transform hover:scale-105"
          >
            <User className="w-5 h-5 text-primary" />
          </div>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 left-0 w-48 bg-surface-raised border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col py-2"
              >
                <div 
                  onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard/profile'); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-white transition-colors"
                >
                  <User className="w-4 h-4 text-foreground-muted" />
                  حساب کاربری
                </div>
                <div 
                  onClick={async () => {
                    await fetch('/auth/signout', { method: 'POST' });
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-rose-500/10 cursor-pointer text-sm text-rose-400 transition-colors border-t border-white/5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  خروج
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
