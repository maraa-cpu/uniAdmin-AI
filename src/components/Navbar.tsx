import React from 'react';
import { Lightbulb, FileText, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'critique' | 'analyzer' | 'ledger';
  setActiveTab: (tab: 'critique' | 'analyzer' | 'ledger') => void;
  pendingTasksCount: number;
  totalPendingPayments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  totalPendingPayments,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('critique')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">UniAdmin AI</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                  Studio & Feasibility
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Valutatore di Fattibilità & Analizzatore Documenti Universitari
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('critique')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'critique'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Valutazione & Critique</span>
              <span className="md:hidden">Critique</span>
            </button>

            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Analizzatore AI</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'ledger'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Timeline Scadenze</span>
              <span className="md:hidden">Timeline</span>
              {pendingTasksCount > 0 && (
                <span className="ml-1 bg-emerald-500 text-slate-950 font-bold text-xs px-1.5 py-0.2 rounded-full">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
