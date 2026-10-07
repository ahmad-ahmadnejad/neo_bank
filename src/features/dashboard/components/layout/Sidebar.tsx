'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CreditCard, PieChart, Bell, Settings, ChevronRight, Wallet, X, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

import { navItems } from '../../constants';

export function Sidebar({ 
  isOpen, 
  setIsOpen, 
  isMobileOpen, 
  setIsMobileOpen 
}: { 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const supabase = createClient();

  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await fetch('/auth/signout', { method: 'POST' });
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-l border-white/5 shadow-glass">
      {/* Brand */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#C4B5FD] flex items-center justify-center shadow-neon shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-white font-extrabold text-xl tracking-tight whitespace-nowrap"
              >
                رسا سامانه
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {/* Mobile Close Button */}
        <button className="lg:hidden text-foreground-muted hover:text-white" onClick={() => setIsMobileOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative",
                isActive ? "text-white" : "text-foreground-muted hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-4">
                <Icon className={cn("w-6 h-6 shrink-0 transition-colors", isActive ? "text-primary" : "text-foreground-muted group-hover:text-primary")} />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 shrink-0 flex flex-col gap-2">
        <button 
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? (
            <Loader2 className="w-6 h-6 shrink-0 animate-spin" />
          ) : (
            <LogOut className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform" />
          )}
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap text-right"
              >
                خروج از حساب
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Desktop Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex absolute -left-4 top-24 w-8 h-8 rounded-full bg-surface-raised border border-white/10 items-center justify-center text-foreground-muted hover:text-white shadow-glass z-50 transition-transform hover:scale-110"
      >
        <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")} />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? '280px' : '90px' }}
        className="hidden lg:block h-screen relative z-40 shrink-0"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-screen w-[280px] z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
