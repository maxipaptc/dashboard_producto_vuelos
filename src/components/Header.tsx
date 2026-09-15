import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { ActiveDashboard, AuthUser } from '../types';
import { TurismocityLogo } from './TurismocityLogo';

interface HeaderProps {
  onOpenSidebar: () => void;
  activeDashboard?: ActiveDashboard;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, user, onLogout }) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-xs border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Hamburger menu button + Official Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              id="btn-open-sidebar"
              onClick={onOpenSidebar}
              className="inline-flex items-center justify-center p-2 text-[#2D384C] hover:text-[#0D47A1] hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Abrir menú de vistas"
              aria-label="Abrir selector de dashboards"
            >
              <Menu className="w-5 h-5 text-[#2D384C]" />
            </button>

            <div className="flex items-center gap-2">
              <TurismocityLogo variant="full" size="md" className="cursor-pointer" />
            </div>
          </div>

          {/* Right: Authenticated User & Logout */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-2">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#3069F6] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {(user.name || user.email || 'T').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#2D384C] leading-tight max-w-[160px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#2D384C] hover:text-red-600 hover:bg-red-50 active:bg-red-100 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Cerrar sesión</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};



