import React, { useState } from 'react';
import { ActionItem, DeadlineItem, PaymentItem } from '../types';
import {
  CalendarCheck,
  CreditCard,
  Download,
  Filter,
  Square,
  Clock,
  Sparkles,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface LedgerEntry {
  docTitle: string;
  docType: string;
  deadlines: DeadlineItem[];
  actions: ActionItem[];
  payments: PaymentItem[];
  dateAdded: string;
}

interface TaskLedgerViewProps {
  entries: LedgerEntry[];
  onToggleAction: (docIndex: number, actionId: string) => void;
  onClearLedger: () => void;
  onGoToAnalyzer: () => void;
}

export const TaskLedgerView: React.FC<TaskLedgerViewProps> = ({
  entries,
  onToggleAction,
  onClearLedger,
  onGoToAnalyzer,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('TUTTE');

  // Compute total pending payments
  const totalPaymentsAmount = entries.reduce((acc, entry) => {
    entry.payments.forEach((p) => {
      const clean = p.amount.replace(/[^0-9,. ]/g, '').replace(',', '.');
      const num = parseFloat(clean);
      if (!isNaN(num)) {
        acc += num;
      }
    });
    return acc;
  }, 0);

  // Compute pending actions count
  const allActions = entries.flatMap((e) => e.actions);
  const pendingActionsCount = allActions.filter((a) => !a.completed).length;

  // Filter entries by selected category
  const filteredEntries = entries.filter((entry) => {
    if (filterCategory === 'TUTTE') return true;
    const typeUpper = entry.docType.toUpperCase();
    if (filterCategory === 'TASSE') return typeUpper.includes('TASSA') || typeUpper.includes('PAGOPA') || typeUpper.includes('RATA');
    if (filterCategory === 'ESAMI') return typeUpper.includes('ESAME') || typeUpper.includes('PROGETTO') || typeUpper.includes('COMUNICAZIONE');
    if (filterCategory === 'AFFITTO') return typeUpper.includes('AFFITTO') || typeUpper.includes('CONTRATTO') || typeUpper.includes('CASA');
    if (filterCategory === 'BORSE') return typeUpper.includes('BORSA') || typeUpper.includes('BANDO') || typeUpper.includes('ESU');
    return true;
  });

  // Generate downloadable iCal (.ics) file content
  const handleDownloadiCal = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Life Admin AI//Student Calendar//IT
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Scadenze Universitarie Life Admin AI\n`;

    entries.forEach((entry) => {
      entry.deadlines.forEach((dl) => {
        const title = `${dl.title} [${entry.docTitle}]`;
        const description = `${dl.description || ''} - Estratto da Life Admin AI`;
        const dateRaw = dl.date.replace(/[^0-9]/g, '');
        const dtString = dateRaw.length >= 8 ? dateRaw.substring(0, 8) + 'T090000Z' : '20260915T090000Z';

        icsContent += `BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:${dtString}
DTEND:${dtString}
STATUS:CONFIRMED
PRIORITY:${dl.critical ? '1' : '3'}
END:VEVENT\n`;
      });
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'scadenze_universitarie_life_admin.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGoogleCalendarUrl = (title: string, dateStr: string) => {
    const text = encodeURIComponent(title);
    const cleanDate = dateStr.replace(/[^0-9]/g, '');
    const formattedDate = cleanDate.length >= 8 ? cleanDate.substring(0, 8) : '20260915';
    const dates = `${formattedDate}T090000Z/${formattedDate}T100000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 font-medium">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Timeline Cronologica Scadenze & Task</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Scadenze e Timeline
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Tutti i compiti, avvisi di pagamento PagoPA e scadenze estratti dai tuoi documenti universitari ordinati cronologicamente.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadiCal}
            disabled={entries.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Esporta Calendario (.ics)</span>
          </button>
          {entries.length > 0 && (
            <button
              onClick={onClearLedger}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-700 transition-colors inline-flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Svuota Registro</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Totale Documenti Analizzati</span>
            <CalendarCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{entries.length}</div>
          <p className="text-xs text-slate-500">Documenti salvati nel registro</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Azioni in Sospeso</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingActionsCount}</div>
          <p className="text-xs text-slate-500">Compiti ancora da completare</p>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>Saldo Pagamenti PagoPA in Sospeso</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            € {totalPaymentsAmount.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-700">Tasse/Affitti da versare</p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {['TUTTE', 'TASSE', 'ESAMI', 'AFFITTO', 'BORSE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'TUTTE'
              ? 'Tutte le Scadenze'
              : cat === 'TASSE'
              ? '💰 Tasse & PagoPA'
              : cat === 'ESAMI'
              ? '🎓 Esami & Progetti'
              : cat === 'AFFITTO'
              ? '🏠 Casa & Affitto'
              : '📜 Borse di Studio'}
          </button>
        ))}
      </div>

      {/* Main Ledger List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Nessuna Scadenza nel Registro</h3>
            <p className="text-sm text-slate-500">
              Analizza una comunicazione universitaria nell'apposita scheda per salvare automaticamente scadenze, pagamenti e task qui.
            </p>
          </div>
          <div>
            <button
              onClick={onGoToAnalyzer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all"
            >
              Vai all'Analizzatore AI
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map((entry, docIdx) => (
            <div
              key={docIdx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {entry.docType}
                    </span>
                    <span className="text-xs text-slate-400">
                      Aggiunto il {entry.dateAdded}
                    </span>
                  </div>
                  <h2 className="font-bold text-slate-900 text-base mt-0.5">
                    {entry.docTitle}
                  </h2>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* Deadlines */}
                {entry.deadlines && entry.deadlines.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Scadenze Tassative:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {entry.deadlines.map((dl, i) => (
                        <div
                          key={i}
                          className="p-3 bg-red-50/50 border border-red-200/80 rounded-xl text-xs space-y-2 text-red-950"
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{dl.title}</span>
                            <span className="text-red-700 font-extrabold bg-white px-2 py-0.5 rounded border border-red-200">
                              {dl.date}
                            </span>
                          </div>
                          {dl.description && <p className="text-red-900/80">{dl.description}</p>}
                          
                          <div className="pt-1">
                            <a
                              href={getGoogleCalendarUrl(`${dl.title} - ${entry.docTitle}`, dl.date)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-indigo-700 hover:underline inline-flex items-center space-x-1 font-bold"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Sincronizza in Google Calendar</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Checklist */}
                {entry.actions && entry.actions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Azioni da Completare:
                    </div>
                    <div className="space-y-1.5">
                      {entry.actions.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => onToggleAction(docIdx, act.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            act.completed
                              ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                              : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 font-medium'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            {act.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span>{act.text}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            {act.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payments */}
                {entry.payments && entry.payments.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Avvisi di Pagamento PagoPA:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {entry.payments.map((p, i) => (
                        <div
                          key={i}
                          className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-1 text-slate-800"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{p.description}</span>
                            <span className="text-emerald-700 text-sm font-mono">{p.amount}</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Metodo: {p.paymentMethod} {p.deadline ? `| Entro il ${p.deadline}` : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
