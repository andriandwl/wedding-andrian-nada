'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface Props {
  userEmail: string;
}

const navItems = [
  {
    section: 'UTAMA',
    items: [
      {
        href: '/admin/dashboard',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        label: 'Dashboard',
        matchPath: '/admin/dashboard',
      },
    ],
  },
  {
    section: 'UNDANGAN',
    items: [
      {
        href: '/admin/invitation',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
        label: 'Pengaturan Undangan',
        matchPath: '/admin/invitation',
      },
      {
        href: '/admin/guests',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        label: 'Daftar Tamu',
        matchPath: '/admin/guests',
      },
    ],
  },
  {
    section: 'PHOTOBOOTH',
    items: [
      {
        href: '/admin/photobooth',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        label: 'Photobooth & QR',
        matchPath: '/admin/photobooth',
      },
    ],
  },
];

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="px-5 py-6 border-b border-rose-900/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
            <span className="text-base">💍</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white leading-tight tracking-wide">Wedding Admin</p>
              <p className="text-xs text-rose-300/70 truncate mt-0.5">Panel Pengelolaan</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-rose-400/60 uppercase">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.matchPath);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                      ${isActive
                        ? 'bg-gradient-to-r from-rose-500/90 to-pink-600/80 text-white shadow-md shadow-rose-500/20'
                        : 'text-rose-100/70 hover:bg-white/5 hover:text-rose-100'
                      }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-rose-300/60 group-hover:text-rose-200'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-200 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 pb-4 border-t border-rose-900/20 pt-4">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white text-xs flex items-center justify-center font-bold shrink-0 shadow">
            {userEmail[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-rose-100/80 font-medium truncate">{userEmail}</p>
              <p className="text-[10px] text-rose-300/50 mt-0.5">Administrator</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Keluar"
              className="shrink-0 p-1 rounded-lg text-rose-300/50 hover:text-rose-200 hover:bg-white/10 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1a0a0e] border-b border-rose-900/30 flex items-center px-4 gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-rose-200 hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center">
            <span className="text-xs">💍</span>
          </div>
          <span className="text-sm font-bold text-white">Wedding Admin</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-gradient-to-b from-[#1a0a0e] via-[#1f0d12] to-[#180810] shadow-2xl transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-gradient-to-b from-[#1a0a0e] via-[#1f0d12] to-[#180810] shadow-xl border-r border-rose-900/20 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-56'}`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#1a0a0e] border border-rose-900/40 flex items-center justify-center text-rose-300/60 hover:text-rose-200 hover:border-rose-700/60 transition shadow-md z-10"
        >
          <svg className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}
