export function LandingFooter() {
  return (
    <footer className="w-full py-8 border-t border-white/5 relative z-10 flex flex-col items-center justify-center gap-6" aria-label="فوتر سایت">
      <nav className="flex items-center gap-8 text-foreground-muted text-sm font-medium" aria-label="لینک‌های فوتر">
        <a href="#" className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded outline-none px-2 py-1">درباره دستیار مالی</a>
        <a href="#" className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded outline-none px-2 py-1">پشتیبانی</a>
        <a href="#" className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded outline-none px-2 py-1">قوانین و حریم خصوصی</a>
      </nav>
      <p className="text-xs text-white/30 tracking-wide">
        تمامی حقوق برای دستیار مالی رسا سامانه محفوظ است © ۱۴۰۳
      </p>
    </footer>
  );
}
