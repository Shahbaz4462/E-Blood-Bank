"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  items: { name: string; href: string; icon: React.ReactNode }[];
}

function ThemeToggle({ theme, toggleTheme }: { theme: "light" | "dark"; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg border border-border bg-background-secondary text-muted hover:text-foreground hover:bg-card-hover transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      )}
    </button>
  );
}

export default function DashboardLayout({ children, title, items }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-border flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">🩸</span>
            <span className="text-lg font-bold text-foreground tracking-tight">
              E-Blood <span className="text-primary">Bank</span>
            </span>
          </Link>
        </div>

        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-lg shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs font-semibold text-warning">{roleLabel} Member</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="sidebar-label mb-2">Navigation</p>
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="sidebar-link w-full text-danger hover:bg-danger/10 !border-l-transparent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        <header className="h-[var(--header-height)] flex items-center justify-between px-6 md:px-8 bg-card border-b border-border shrink-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="md:hidden p-2 rounded-lg border border-border bg-background-secondary text-muted hover:text-foreground"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-foreground truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-3 relative">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <div
              className="flex items-center gap-3 cursor-pointer pl-2 rounded-lg hover:bg-background-secondary py-1 pr-1 transition-colors"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                <span className="text-xs font-medium text-accent">{roleLabel}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-bold text-sm border-2 border-background shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg p-1.5 z-40 animate-fade-in">
                  <Link
                    href={`/dashboard/${user?.role}/profile`}
                    className="block px-4 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-[var(--sidebar-active)]"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href={`/dashboard/${user?.role}/profile`}
                    className="block px-4 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-[var(--sidebar-active)]"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-border my-1.5" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-danger hover:bg-danger/10 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-background-secondary">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
