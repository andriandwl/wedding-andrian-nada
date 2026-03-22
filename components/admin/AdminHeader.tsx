'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface Props {
  userEmail: string;
}

export default function AdminHeader({ userEmail }: Props) {
  const pathname   = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-xl">💍</span>
            <span className="font-semibold text-gray-900 text-sm hidden sm:block">
              Wedding Admin
            </span>

            {/* Nav links */}
            <nav className="flex items-center gap-1 ml-4">
              <NavLink href="/admin/guests" active={pathname.startsWith('/admin/guests')}>
                Tamu
              </NavLink>
            </nav>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
                {userEmail[0].toUpperCase()}
              </div>
              <span className="hidden sm:block max-w-[140px] truncate">{userEmail}</span>
              <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Masuk sebagai</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        active
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}
