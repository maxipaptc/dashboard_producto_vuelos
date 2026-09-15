import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActiveDashboard, AuthUser } from '../types';
import { X, Percent, Layers, Check, Luggage, LogOut } from 'lucide-react';
import { TurismocityLogo } from './TurismocityLogo';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDashboard: ActiveDashboard;
  onSelectDashboard: (dashboard: ActiveDashboard) => void;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeDashboard,
  onSelectDashboard,
  user,
  onLogout,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          {/* Backdrop with smooth fade in / fade out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Left Drawer Panel container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pointer-events-none">
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-72 sm:w-80 bg-white shadow-xl border-r border-slate-200 flex flex-col h-full z-10 pointer-events-auto"
              aria-label="Selector de Dashboards"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <TurismocityLogo variant="full" size="sm" />
                </div>
                <button
                  id="btn-close-sidebar"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  aria-label="Cerrar panel lateral"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body: Dashboard List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Dashboards disponibles
                </div>

                {/* Option 1: CTR filtros */}
                <button
                  id="btn-nav-ctr-filtros"
                  onClick={() => {
                    onSelectDashboard('ctr');
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                    activeDashboard === 'ctr'
                      ? 'bg-blue-50/50 border-[#3069F6] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 transition-colors ${
                      activeDashboard === 'ctr' ? 'bg-[#3069F6] text-white shadow-xs' : 'bg-slate-100 text-[#2D384C]'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${
                          activeDashboard === 'ctr' ? 'text-[#0D47A1]' : 'text-[#2D384C]'
                        }`}
                      >
                        CTR filtros
                      </span>
                      {activeDashboard === 'ctr' && (
                        <span className="bg-[#3069F6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Search, Click_flight y tasa de CTR por filtro de vuelos.
                    </p>
                  </div>
                  {activeDashboard === 'ctr' && (
                    <div className="absolute right-3 top-3.5 text-[#3069F6]">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Option 2: Uso filtros */}
                <button
                  id="btn-nav-uso-filtros"
                  onClick={() => {
                    onSelectDashboard('uso');
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                    activeDashboard === 'uso'
                      ? 'bg-blue-50/50 border-[#3069F6] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 transition-colors ${
                      activeDashboard === 'uso' ? 'bg-[#3069F6] text-white shadow-xs' : 'bg-slate-100 text-[#2D384C]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${
                          activeDashboard === 'uso' ? 'text-[#0D47A1]' : 'text-[#2D384C]'
                        }`}
                      >
                        Uso filtros
                      </span>
                      {activeDashboard === 'uso' && (
                        <span className="bg-[#3069F6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Event_count y volumen de interacción con los filtros.
                    </p>
                  </div>
                  {activeDashboard === 'uso' && (
                    <div className="absolute right-3 top-3.5 text-[#3069F6]">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Option 3: Información de equipaje */}
                <button
                  id="btn-nav-info-equipaje"
                  onClick={() => {
                    onSelectDashboard('equipaje');
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                    activeDashboard === 'equipaje'
                      ? 'bg-blue-50/50 border-[#3069F6] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 transition-colors ${
                      activeDashboard === 'equipaje' ? 'bg-[#3069F6] text-white shadow-xs' : 'bg-slate-100 text-[#2D384C]'
                    }`}
                  >
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${
                          activeDashboard === 'equipaje' ? 'text-[#0D47A1]' : 'text-[#2D384C]'
                        }`}
                      >
                        Información de equipaje
                      </span>
                      {activeDashboard === 'equipaje' && (
                        <span className="bg-[#3069F6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Medidas, pesos y franquicias informativas por aerolínea.
                    </p>
                  </div>
                  {activeDashboard === 'equipaje' && (
                    <div className="absolute right-3 top-3.5 text-[#3069F6]">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>

              {/* User Profile in Drawer */}
              {user && (
                <div className="p-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-7 h-7 rounded-full border border-slate-200 object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#3069F6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {(user.name || user.email || 'T').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-xs font-semibold text-[#2D384C] leading-tight truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Footer of Sidebar */}
              <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                <span>Turismocity • Vuelos</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Conectado
                </span>
              </div>
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
