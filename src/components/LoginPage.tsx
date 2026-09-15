import React, { useEffect, useState, useRef } from 'react';
import { AuthUser } from '../types';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { TurismocityLogo } from './TurismocityLogo';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const clientId =
    (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
    '142542304048-o720ijv84eq6u709pc71rupap5b6o2fh.apps.googleusercontent.com';

  // Decode standard JWT token from Google Identity Services
  const decodeJwtResponse = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decodificando token Google', e);
      return null;
    }
  };

  // Process Google SSO credential
  const handleCredentialResponse = (response: any) => {
    setError(null);
    if (!response || !response.credential) {
      setError('No se recibieron credenciales de Google. Inténtalo de nuevo.');
      return;
    }

    const payload = decodeJwtResponse(response.credential);
    if (!payload || !payload.email) {
      setError('No se pudo validar el correo electrónico desde la cuenta de Google.');
      return;
    }

    const email = payload.email.toLowerCase().trim();
    const isAuthorizedDomain =
      email.endsWith('@turismocity.com') ||
      email.endsWith('@turismocity.com.ar');

    if (!isAuthorizedDomain) {
      setError(
        `Acceso restringido: La cuenta "${payload.email}" no pertenece al dominio institucional @turismocity.com. Por favor, selecciona tu cuenta corporativa de Turismocity.`
      );
      return;
    }

    // Successfully verified @turismocity.com
    const user: AuthUser = {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
      hd: payload.hd || 'turismocity.com',
    };

    onLoginSuccess(user);
  };

  // Initialize Google Identity Services
  useEffect(() => {
    let intervalId: any = null;

    const initGoogleGsi = () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        setIsGsiLoaded(true);

        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            hosted_domain: 'turismocity.com',
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            google.accounts.id.renderButton(googleBtnRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 280,
            });
          }
        } catch (err) {
          console.error('Error al inicializar Google Sign-In:', err);
        }

        if (intervalId) clearInterval(intervalId);
      }
    };

    // Try immediately
    initGoogleGsi();

    // Poll until script finishes loading
    intervalId = setInterval(initGoogleGsi, 300);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clientId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Brand Header: Minimalist & Clean */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100 flex flex-col items-center">
          <div className="mb-4">
            <TurismocityLogo variant="full" size="lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 text-[11px] font-medium text-[#2D384C] tracking-wide">
            <span>Dashboard Producto Vuelos</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-semibold text-[#2D384C]">
              Inicio de sesión corporativo
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Accede con tu cuenta institucional de Google Workspace para consultar métricas y reportes.
            </p>
          </div>

          {/* Domain requirement badge - Clean & Minimal */}
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-[#0D47A1] font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#3069F6]" />
            <span>Exclusivo para cuentas <strong className="font-semibold text-[#0D47A1]">@turismocity.com</strong></span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Google Sign-In Container */}
          <div className="flex flex-col items-center justify-center min-h-[46px] pt-1">
            <div ref={googleBtnRef} id="google-btn-container" className="flex justify-center" />
            
            {!isGsiLoaded && (
              <div className="text-xs text-slate-400 flex items-center gap-2 py-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#3069F6] rounded-full animate-spin"></span>
                Iniciando servicios de Google...
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/70 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Turismocity • Uso interno y confidencial
        </div>
      </div>
    </div>
  );
};
