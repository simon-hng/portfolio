"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Notebook, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/blog", label: "Blog", icon: Notebook },
];

export function Nav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-4 right-4 md:top-6 md:right-6 z-50 hidden md:block">
      <div className="flex items-center gap-0.5 p-1 bg-background/80 dark:bg-background/70 backdrop-blur-xl border border-border/50 dark:border-border/30 rounded-full shadow-[0_1px_2px_hsl(var(--foreground)/0.04),0_4px_12px_hsl(var(--foreground)/0.04)] dark:shadow-[0_1px_2px_hsl(0_0%_0%/0.2),0_4px_16px_hsl(0_0%_0%/0.3),inset_0_1px_0_hsl(var(--foreground)/0.03)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[0.8125rem] font-medium transition-all cursor-pointer bg-transparent border-none no-underline ${
                isActive 
                  ? "text-foreground bg-muted" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}

        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[0.8125rem] font-medium text-muted-foreground transition-all cursor-pointer bg-transparent border-none hover:text-foreground hover:bg-muted/80"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-4 h-4 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 shrink-0" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>
      </div>
    </nav>
  );
}
