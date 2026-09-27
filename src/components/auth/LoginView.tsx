import React, { useState } from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { ShieldAlert, ArrowRight, CheckCircle2, Sun, Moon } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme } = useMonitoring();
  const [email, setEmail] = useState('marcus.vance@geomonitor.org');
  const [accessKey, setAccessKey] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#F7F8FA] dark:bg-[#09090b] text-[#111827] dark:text-zinc-100 relative overflow-hidden select-none transition-colors duration-200">
      {/* Decorative ambient glows */}
      <div className="absolute w-[500px] h-[500px] bg-teal-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      {/* Theme toggle in top-right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[#6B7280] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-100 transition-colors shadow-sm"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#121217] border border-gray-200 dark:border-zinc-800/80 p-6 sm:p-8 shadow-card-light dark:shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 dark:bg-emerald-500/10 border border-teal-200 dark:border-emerald-500/30 text-[#0F766E] dark:text-emerald-400 mb-4 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-[#0F766E] dark:text-emerald-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>

          <h1 className="text-2xl font-bold font-sans text-[#111827] dark:text-zinc-100 tracking-tight">
            LANDSAFE
          </h1>
          <p className="text-[13px] font-sans text-[#4B5563] dark:text-zinc-400 mt-1 uppercase tracking-wider font-medium">
            IoT Landslide Early Warning & Monitoring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-sans text-[#4B5563] dark:text-zinc-400 mb-1.5 uppercase font-semibold tracking-wider">
              Field Engineer ID / Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-sans text-[#111827] dark:text-zinc-100 placeholder-[#6B7280] focus:outline-none focus:border-[#0F766E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-sans text-[#4B5563] dark:text-zinc-400 mb-1.5 uppercase font-semibold tracking-wider">
              Security Token / Passkey
            </label>
            <input
              type="password"
              required
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-mono text-[#111827] dark:text-zinc-100 placeholder-[#6B7280] focus:outline-none focus:border-[#0F766E] transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0F766E] hover:bg-[#115e59] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-sans font-semibold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow disabled:opacity-50"
            >
              {loading ? (
                <span>AUTHENTICATING TELEMETRY BUS...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E2E8F0] dark:border-zinc-800/80 text-center">
          <button
            onClick={() => login()}
            className="text-xs font-sans text-[#0F766E] hover:text-[#115e59] dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center justify-center gap-1.5 mx-auto transition-colors font-semibold"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1-Click Demo Access (Geotechnical Specialist)</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-xs font-sans text-[#6B7280] dark:text-zinc-500 uppercase tracking-wider font-medium">
            SECURE GEOTECHNICAL SENSOR NETWORK • PHASE 1
          </span>
        </div>
      </div>
    </div>
  );
};
