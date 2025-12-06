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
    <nav className="nav-container">
      <div className="nav-inner">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}

        <div className="nav-divider" />

        <button
          onClick={toggleTheme}
          className="nav-item"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="nav-icon" />
            ) : (
              <Moon className="nav-icon" />
            )
          ) : (
            <div className="nav-icon" />
          )}
        </button>
      </div>
    </nav>
  );
}

