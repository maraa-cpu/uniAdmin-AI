import React, { useState } from 'react';
import { IDEA_PIVOTS } from '../data/samples';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock,
  Layers,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';

interface IdeaCritiqueViewProps {
  onSelectPivot: (pivotId: string) => void;
  onGoToAnalyzer: () => void;
}

export const IdeaCritiqueView: React.FC<IdeaCritiqueViewProps> = ({
  onGoToAnalyzer,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [aiCritiqueResponse, setAiCritiqueResponse] = useState<string | null>(null);
  const [loadingCritique, setLoadingCritique] = useState(false);

  const handleAskStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setLoadingCritique(true);
    try {
      const res = await fetch('/api/critique-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: userQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setAiCritiqueResponse(data.response);
      } else {
        setAiCritiqueResponse('Impossibile ottenere risposta al momento. Riprova tra poco.');
      }
    } catch (err) {
      setAiCritiqueResponse('Errore di connessione con il server per l\'analisi strategica.');
    } finally {
      setLoadingCritique(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/30 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Valutazione Strategica dell'Idea & AI Feasibility</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Gestione Burocrazia Universitaria con l'AI: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300">
              Opportunità Reali vs. Rischi Critici
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            È un problema reale e doloroso per milioni di studenti in Italia. Tuttavia, applicare l'intelligenza artificiale
            ai documenti ufficiali richiede attenzione: <strong className="text-amber-300">un'allucinazione su una scadenza d'esame o d'ISEE può costare una borsa di studio o generare indennità di mora</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onGoToAnalyzer}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Prova il Prototipo Live dell'Analizzatore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#pivots"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <span>Scopri le 3 Alternative (Pivots)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Radar Matrix & Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Utilità Percepita</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">95/100</div>
          <p className="text-xs text-slate-500">
            Forte bisogno reale per studenti sopraffatti da bandi ESU, mail e PagoPA.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Fattibilità Tecnica AI</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">88/100</div>
          <p className="text-xs text-slate-500">
            I moderni LLM (es. Gemini 3.6 Flash) eccellono nell'estrazione dati da PDF e immagini.
          </p>
        </div>

        <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <span>Affidabilità (No Error)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900">45/100</div>
          <p className="text-xs text-amber-700">
            RISCHIO: Tolleranza zero agli errori sulle scadenze perentorie.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Integrazione Sistemi</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">30/100</div>
          <p className="text-xs text-slate-500">
            Esse3 e SmartEdu sono sistemi universitari chiusi senza API pubbliche.
          </p>
        </div>
      </div>

      {/* Deep-Dive: Dove l'AI eccelle vs Dove Fallisce */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vantaggi AI */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-emerald-800">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Dove l'AI Porta un VERO Vantaggio</h2>
              <p className="text-xs text-slate-500">Funzionalità in cui la tecnologia LLM eccelle ed elimina fatica</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start space-x-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-600 text-lg leading-none">1</span>
              <div>
                <strong className="text-slate-900 block font-semibold">Traduzione Burocratico → Italiano Semplice</strong>
                I bandi universitari usano gergo normativo ostico. L'AI sintetizza in 2 frasi trasparenti il significato reale e le conseguenze.
              </div>
            </li>
            <li className="flex items-start space-x-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-600 text-lg leading-none">2</span>
              <div>
                <strong className="text-slate-900 block font-semibold">Estrazione Automatica di Entità Strutturate</strong>
                Trasforma PDF disordinati di 20 pagine o mail del professore in: Date tassative, Importi €, Codici PagoPA/IUV e Documenti necessari.
              </div>
            </li>
            <li className="flex items-start space-x-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-600 text-lg leading-none">3</span>
              <div>
                <strong className="text-slate-900 block font-semibold">Generazione di Checklist Operative Interattive</strong>
                Riconosce le azioni da compiere (es. "Compila il Modulo A", "Paga con PagoPA", "Richiedi l'ISEE") trasformandole in una to-do list dinamica.
              </div>
            </li>
          </ul>
        </div>

        {/* Rischi e Limiti dell'Idea */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-red-800">
            <div className="p-2.5 bg-red-100 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">I Rischi Critici & Messa in Discussione</h2>
              <p className="text-xs text-slate-500">Ostacoli strutturali da considerare prima di sviluppare</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start space-x-3 bg-red-50/40 p-3 rounded-xl border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Le Allucinazioni sulle Scadenze Tassative</strong>
                Se l'AI confonde il "15 Settembre ore 12:00" con il "15 Ottobre", lo studente perde la borsa di studio o paga mori salate. L'app non può basarsi puramente sulla cieca fiducia dell'AI.
              </div>
            </li>
            <li className="flex items-start space-x-3 bg-red-50/40 p-3 rounded-xl border border-red-100">
              <Lock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Privacy e Dati Sensibili (GDPR)</strong>
                I documenti universitari contengono Codice Fiscale, ISEE, dati bancari, voti e indirizzi. Inviare tali dati ad un'API esterna senza mascheramento o trasparenza è un problema di privacy.
              </div>
            </li>
            <li className="flex items-start space-x-3 bg-red-50/40 p-3 rounded-xl border border-red-100">
              <Layers className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Assenza di Integrazione Automatica (No API)</strong>
                Sistemi universitari come CINECA Esse3 o SmartEdu richiedono autenticazione SPID e non offrono webhook o API. L'app non potrà mai iscrivere automaticamente lo studente ad un esame o pagare PagoPA senza un'azione manuale dello studente.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Proposed Pivots / Specific Versions Section */}
      <div id="pivots" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>3 Versioni Più Specifiche e Utili (Pivots Strategici)</span>
            </h2>
            <p className="text-sm text-slate-500">
              Per rendere l'app veramente di successo, ti consigliamo di focalizzare l'ambito iniziale su uno di questi 3 posizionamenti:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {IDEA_PIVOTS.map((pivot) => (
            <div
              key={pivot.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-100">
                    Punteggio Fattibilità AI: {pivot.aiFeasibilityScore}%
                  </span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {pivot.title}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                  {pivot.tagline}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pivot.description}
                </p>

                <div className="pt-2 space-y-2 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Punto di Forza Principale:
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 border border-slate-200/60 font-medium">
                    ⚡ {pivot.keyFeature}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-slate-700">A chi si rivolge:</div>
                  <p className="text-xs text-slate-500 italic">{pivot.targetUser}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onGoToAnalyzer}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold py-2.5 rounded-xl border border-slate-200 transition-colors"
                >
                  <span>Sperimenta con documenti di prova</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Strategy Assistant / Challenge Simulator */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white space-y-6 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600/30 rounded-xl border border-indigo-500/30">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Chiedi un parere o metti alla prova la tua idea in tempo reale</h2>
            <p className="text-xs text-slate-400">
              Poni una domanda specifica al nostro AI Product Strategist per analizzare modelli di business, posizionamento o dettagli tecnici.
            </p>
          </div>
        </div>

        <form onSubmit={handleAskStrategy} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Es. Come posso evitare che l'AI inventi le date delle tasse? Oppure: Come potrei monetizzare l'app?"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loadingCritique || !userQuery.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shrink-0 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              {loadingCritique ? (
                <span>Analisi in corso...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analizza Idea</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-slate-400">Suggerimenti rapidi:</span>
            <button
              type="button"
              onClick={() => setUserQuery('Quali sono le strategie migliori per prevenire allucinazioni sulle scadenze d\'esame e tasse?')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700"
            >
              Come prevenire allucinazioni sulle scadenze?
            </button>
            <button
              type="button"
              onClick={() => setUserQuery('Come posso gestire la privacy dei dati sensibili come l\'ISEE senza violare il GDPR?')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700"
            >
              Come gestire la privacy ISEE e GDPR?
            </button>
            <button
              type="button"
              onClick={() => setUserQuery('Qual è un possibile modello di business freemium sostenibile per studenti italiani?')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700"
            >
              Modello di Business sostenibile?
            </button>
          </div>
        </form>

        {aiCritiqueResponse && (
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5 text-sm space-y-3 leading-relaxed text-slate-200">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Risposta AI Product Strategist</span>
            </div>
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-sans text-sm">
              {aiCritiqueResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
