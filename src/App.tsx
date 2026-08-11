import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { IdeaCritiqueView } from './components/IdeaCritiqueView';
import { DocumentAnalyzerView } from './components/DocumentAnalyzerView';
import { TaskLedgerView } from './components/TaskLedgerView';
import { ParsedDocumentResult, StudentProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'critique' | 'analyzer' | 'ledger'>('critique');

  // Student Profile state for CFU & Libretto Cross-Check
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Marco Rossi',
    university: 'Università degli Studi di Milano',
    course: 'Informatica (L-31)',
    currentCFU: 42,
    iseeValue: 18500,
    passedExams: ['Programmazione 1', 'Analisi Matematica 1', 'Fisica Generale'],
  });

  // Ledger state for saved document analysis results
  const [ledgerEntries, setLedgerEntries] = useState<
    Array<{
      docTitle: string;
      docType: string;
      deadlines: any[];
      actions: any[];
      payments: any[];
      dateAdded: string;
    }>
  >([
    // Initial sample saved entry to make the timeline look alive!
    {
      docTitle: 'Bando Borsa di Studio & Alloggio 2026/2027',
      docType: 'Bando Concorso ESU/EDISU',
      deadlines: [
        {
          title: 'Scadenza Presentazione Domanda On-line ESU',
          date: '15 Settembre 2026',
          time: 'Ore 12:00',
          description: 'Invio telematico della richiesta su Portale ESU.',
          critical: true,
        },
        {
          title: 'Sottoscrizione Attestazione ISEE Universitario',
          date: '31 Agosto 2026',
          description: 'Richiesta DSU sul sito INPS o tramite CAF.',
          critical: true,
        },
      ],
      actions: [
        { id: 'act-1', text: 'Richiedere ISEE Universitario 2026 al CAF / INPS', category: 'COMPILAZIONE', completed: false },
        { id: 'act-2', text: 'Scansionare Carta d\'Identità in corso di validità', category: 'INVIO_DOCUMENTI', completed: true },
        { id: 'act-3', text: 'Versare Tassa Regionale € 140,00 tramite PagoPA', category: 'PAGAMENTO', completed: false },
      ],
      payments: [
        { description: 'Tassa Regionale Diritto allo Studio', amount: '140.00 €', paymentMethod: 'PagoPA', deadline: '30/09/2026' },
      ],
      dateAdded: 'Oggi',
    },
  ]);

  // Handle adding new parsed document result to ledger
  const handleSaveResultToLedger = (result: ParsedDocumentResult) => {
    const newEntry = {
      docTitle: result.documentTitle,
      docType: result.documentType,
      deadlines: result.deadlines,
      actions: result.actions,
      payments: result.payments,
      dateAdded: new Date().toLocaleDateString('it-IT'),
    };
    setLedgerEntries([newEntry, ...ledgerEntries]);
  };

  // Toggle action completion inside ledger
  const handleToggleActionInLedger = (docIndex: number, actionId: string) => {
    const updated = [...ledgerEntries];
    const targetDoc = updated[docIndex];
    if (targetDoc) {
      targetDoc.actions = targetDoc.actions.map((act) =>
        act.id === actionId ? { ...act, completed: !act.completed } : act
      );
      setLedgerEntries(updated);
    }
  };

  // Clear ledger
  const handleClearLedger = () => {
    if (window.confirm('Sei sicuro di voler svuotare il registro delle scadenze?')) {
      setLedgerEntries([]);
    }
  };

  // Compute pending counts
  const allPendingActions = ledgerEntries.flatMap((e) => e.actions).filter((a) => !a.completed);
  const pendingTasksCount = allPendingActions.length;

  const totalPayments = ledgerEntries.reduce((acc, entry) => {
    entry.payments.forEach((p) => {
      const clean = p.amount.replace(/[^0-9,. ]/g, '').replace(',', '.');
      const num = parseFloat(clean);
      if (!isNaN(num)) acc += num;
    });
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={pendingTasksCount}
        totalPendingPayments={totalPayments}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'critique' && (
          <IdeaCritiqueView
            onSelectPivot={(pivotId) => {
              setActiveTab('analyzer');
            }}
            onGoToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}

        {activeTab === 'analyzer' && (
          <DocumentAnalyzerView
            onSaveResultToLedger={handleSaveResultToLedger}
            studentProfile={studentProfile}
            onUpdateStudentProfile={setStudentProfile}
          />
        )}

        {activeTab === 'ledger' && (
          <TaskLedgerView
            entries={ledgerEntries}
            onToggleAction={handleToggleActionInLedger}
            onClearLedger={handleClearLedger}
            onGoToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>UniAdmin AI</strong> — Progetto di Studio & Prototipo di Analisi Documentale per Studenti Universitari.
          </div>
          <div className="text-slate-400">
            Powered by Gemini 3.6 Flash & Node.js Express
          </div>
        </div>
      </footer>
    </div>
  );
}
