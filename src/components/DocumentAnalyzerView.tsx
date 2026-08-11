import React, { useState } from 'react';
import { ParsedDocumentResult, StudentProfile, ActionItem, DeadlineItem, PaymentItem, RequiredDocument } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/samples';
import {
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Square,
  Calendar,
  CreditCard,
  Paperclip,
  ShieldCheck,
  Zap,
  Download,
  Copy,
  Check,
  RefreshCw,
  Info,
  GraduationCap,
  Edit3,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface DocumentAnalyzerViewProps {
  onSaveResultToLedger: (result: ParsedDocumentResult) => void;
  studentProfile: StudentProfile;
  onUpdateStudentProfile: (profile: StudentProfile) => void;
}

export const DocumentAnalyzerView: React.FC<DocumentAnalyzerViewProps> = ({
  onSaveResultToLedger,
  studentProfile,
  onUpdateStudentProfile,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bando-borsa-studio');
  const [inputText, setInputText] = useState<string>(SAMPLE_DOCUMENTS[0].fullText);
  const [customContext, setCustomContext] = useState<string>('');
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string; name: string } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<ParsedDocumentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copied, setCopied] = useState<boolean>(false);
  const [savedToLedger, setSavedToLedger] = useState<boolean>(false);

  // Student Profile Editing state
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState<StudentProfile>(studentProfile);

  // Handle preset click
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === presetId);
    if (sample) {
      setInputText(sample.fullText);
      setFileData(null);
      setParsedResult(null);
      setErrorMsg(null);
      setSavedToLedger(false);
    }
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Il file è troppo grande. Scegli un file inferiore a 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(',')[1];
      setFileData({
        base64: base64Data,
        mimeType: file.type || 'application/pdf',
        name: file.name,
      });
      setInputText('');
      setSelectedPresetId('');
      setParsedResult(null);
      setErrorMsg(null);
      setSavedToLedger(false);
    };
    reader.readAsDataURL(file);
  };

  // Run AI Parse
  const handleParse = async () => {
    if (!inputText.trim() && !fileData) {
      alert('Incolla il testo del documento o carica un file prima di procedere.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setParsedResult(null);
    setSavedToLedger(false);

    try {
      const res = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentText: inputText,
          fileData: fileData?.base64,
          mimeType: fileData?.mimeType,
          customContext: customContext,
          studentProfile: studentProfile,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setParsedResult(data.data);
      } else {
        setErrorMsg(data.error || 'Errore durante l\'analisi del documento con Gemini.');
      }
    } catch (err: any) {
      setErrorMsg('Errore di connessione con il server dell\'AI: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Toggle Action Completion
  const handleToggleAction = (id: string) => {
    if (!parsedResult) return;
    const updatedActions = parsedResult.actions.map((act) =>
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setParsedResult({ ...parsedResult, actions: updatedActions });
  };

  // Manual Editing Handlers
  const handleUpdateTitle = (title: string) => {
    if (!parsedResult) return;
    setParsedResult({ ...parsedResult, documentTitle: title });
  };

  const handleUpdateDeadlineDate = (index: number, date: string) => {
    if (!parsedResult) return;
    const updated = [...parsedResult.deadlines];
    updated[index] = { ...updated[index], date };
    setParsedResult({ ...parsedResult, deadlines: updated });
  };

  const handleUpdateDeadlineReminder = (index: number, days: number) => {
    if (!parsedResult) return;
    const updated = [...parsedResult.deadlines];
    updated[index] = { ...updated[index], reminderLeadDays: days };
    setParsedResult({ ...parsedResult, deadlines: updated });
  };

  const handleAddAction = () => {
    if (!parsedResult) return;
    const newAct: ActionItem = {
      id: 'act-' + Date.now(),
      text: 'Nuova azione da completare',
      category: 'ALTRO',
      completed: false,
    };
    setParsedResult({ ...parsedResult, actions: [...parsedResult.actions, newAct] });
  };

  const handleRemoveAction = (id: string) => {
    if (!parsedResult) return;
    setParsedResult({
      ...parsedResult,
      actions: parsedResult.actions.filter((a) => a.id !== id),
    });
  };

  // Save to timeline ledger
  const handleSaveLedger = () => {
    if (!parsedResult) return;
    onSaveResultToLedger(parsedResult);
    setSavedToLedger(true);
  };

  // Copy JSON
  const handleCopyJSON = () => {
    if (!parsedResult) return;
    navigator.clipboard.writeText(JSON.stringify(parsedResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save Profile
  const handleSaveProfile = () => {
    onUpdateStudentProfile(editProfile);
    setShowProfileModal(false);
  };

  // Google Calendar URL generator helper
  const getGoogleCalendarUrl = (title: string, dateStr: string, desc: string) => {
    const text = encodeURIComponent(title);
    const details = encodeURIComponent(desc || 'Aggiunto da Life Admin AI');
    // Basic date formatter for YYYYMMDD
    const cleanDate = dateStr.replace(/[^0-9]/g, '');
    const formattedDate = cleanDate.length >= 8 ? cleanDate.substring(0, 8) : '20260915';
    const dates = `${formattedDate}T090000Z/${formattedDate}T100000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Analizzatore AI per Studenti Universitari</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Analizza Documenti, Email e Bandi Universitari
          </h1>
          <p className="text-sm text-slate-500">
            Incolla avvisi Esse3, email dei professori o carica PDF. L'AI estrarrà scadenze, pagamenti PagoPA, documenti e requisiti CFU.
          </p>
        </div>

        {/* Student Profile Quick Badge & Modal Trigger */}
        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <span>{studentProfile.name}</span>
              <span className="text-slate-400 font-normal">({studentProfile.university})</span>
            </div>
            <div className="text-slate-500 flex items-center space-x-2">
              <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-mono font-bold">
                {studentProfile.currentCFU} CFU
              </span>
              <span>• ISEE: €{studentProfile.iseeValue}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditProfile(studentProfile);
              setShowProfileModal(true);
            }}
            className="text-xs bg-white hover:bg-slate-100 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center space-x-1"
          >
            <Edit3 className="w-3 h-3 text-indigo-600" />
            <span>Modifica</span>
          </button>
        </div>
      </div>

      {/* Preset Documents Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>1. Seleziona un Documento di Prova Pre-caricato (oppure carica/incolla sotto)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectPreset(sample.id)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                selectedPresetId === sample.id
                  ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {sample.type}
                  </span>
                  {selectedPresetId === sample.id && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sample.preview}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>2. Testo Comunicazione / Email o Caricamento File (PDF/Immagini)</span>
          </label>

          {/* File upload button */}
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer inline-flex items-center space-x-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>{fileData ? fileData.name : 'Carica File / PDF'}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {fileData && (
              <button
                onClick={() => setFileData(null)}
                className="text-xs text-red-600 hover:underline"
              >
                Rimuovi
              </button>
            )}
          </div>
        </div>

        {/* Textarea or uploaded file badge */}
        {fileData ? (
          <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="font-bold text-slate-900">{fileData.name}</p>
                <p className="text-xs text-slate-500">File allegato pronto per essere analizzato via Gemini OCR</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md">
              MIME: {fileData.mimeType}
            </span>
          </div>
        ) : (
          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedPresetId('');
            }}
            placeholder="Incolla qui la comunicazione della segreteria, l'email del docente, il testo del bando di concorso o la ricevuta..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
          />
        )}

        {/* Mandatory / Optional Context Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            <span>Nota Contestuale Opzionale (Aggiungi contesto per l'AI)</span>
          </label>
          <input
            type="text"
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Es. 'Email inviata dal professore dopo il ricevimento' oppure 'Avviso per la 2° rata iscrizione'"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Analyze Button */}
        <div className="pt-2">
          <button
            onClick={handleParse}
            disabled={loading || (!inputText.trim() && !fileData)}
            className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analisi in corso e controllo libretto con Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Analizza Comunicazione e Sincronizza Libretto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Errore durante l'elaborazione:</strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Result Display Section */}
      {parsedResult && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-xl overflow-hidden space-y-0 transition-all">
          {/* Header of Analysis */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {parsedResult.documentType}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    parsedResult.urgency === 'ALTA'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : parsedResult.urgency === 'MEDIA'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  Urgenza: {parsedResult.urgency}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <span className="text-slate-400">Confidenza AI:</span>
                <span className="font-mono font-bold text-emerald-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                  {parsedResult.aiConfidenceScore}%
                </span>
              </div>
            </div>

            {/* Editable Title */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Titolo Documento (Modificabile):
              </label>
              <input
                type="text"
                value={parsedResult.documentTitle}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="w-full bg-slate-800/80 text-2xl font-extrabold text-white border border-slate-700 focus:border-indigo-400 rounded-lg px-3 py-1.5 focus:outline-none"
              />
              <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                {parsedResult.summary}
              </p>
            </div>
          </div>

          {/* Academic Requirements & CFU Cross-Check Result Badge */}
          {parsedResult.academicRequirements && (
            <div
              className={`p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                parsedResult.academicRequirements.eligibilityStatus === 'ELIGIBLE'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : parsedResult.academicRequirements.eligibilityStatus === 'INELIGIBLE'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-950'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
                    parsedResult.academicRequirements.eligibilityStatus === 'ELIGIBLE'
                      ? 'bg-emerald-600'
                      : parsedResult.academicRequirements.eligibilityStatus === 'INELIGIBLE'
                      ? 'bg-red-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider flex items-center space-x-2">
                    <span>Riscontro Libretto Universitario & CFU</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200">
                      Cross-Check
                    </span>
                  </div>
                  <p className="font-bold text-sm mt-0.5">
                    {parsedResult.academicRequirements.statusMessage}
                  </p>
                  {parsedResult.academicRequirements.propedeuticityNote && (
                    <p className="text-xs opacity-80 mt-1">
                      Note Propedeuticità: {parsedResult.academicRequirements.propedeuticityNote}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-sm text-slate-800">
                Tu Hai: <strong>{studentProfile.currentCFU} CFU</strong>
              </div>
            </div>
          )}

          {/* Verification Alert Box (Human-in-the-Loop Safeguard) */}
          {parsedResult.verificationAlerts && parsedResult.verificationAlerts.length > 0 && (
            <div className="bg-amber-50 border-b border-amber-200 p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Controllo Qualità & Avviso di Verifica Obbligatoria (Human Verification)</span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                {parsedResult.verificationAlerts.map((alert, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <strong>Punto critico da verificare sul portale:</strong> {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6 space-y-8">
            {/* Scadenze Tassative con Promemoria Personalizzati e Calendario */}
            {parsedResult.deadlines && parsedResult.deadlines.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>Scadenze Tassative Rilevate ({parsedResult.deadlines.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parsedResult.deadlines.map((dl, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        dl.critical
                          ? 'bg-red-50/60 border-red-200 text-red-950'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm leading-snug">{dl.title}</span>
                        {dl.critical && (
                          <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-red-300 uppercase shrink-0">
                            Perentoria
                          </span>
                        )}
                      </div>

                      {/* Editable date & reminder selector */}
                      <div className="space-y-2 bg-white p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Data Scadenza:</span>
                          </span>
                          <input
                            type="text"
                            value={dl.date}
                            onChange={(e) => handleUpdateDeadlineDate(idx, e.target.value)}
                            className="text-xs font-bold text-indigo-700 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-right focus:outline-none"
                          />
                        </div>

                        {/* Reminder lead days selector */}
                        <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-1.5">
                          <span>Anticipo Promemoria:</span>
                          <select
                            value={dl.reminderLeadDays || 3}
                            onChange={(e) => handleUpdateDeadlineReminder(idx, Number(e.target.value))}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5 font-medium"
                          >
                            <option value={1}>1 giorno prima</option>
                            <option value={3}>3 giorni prima</option>
                            <option value={7}>7 giorni prima</option>
                          </select>
                        </div>
                      </div>

                      {/* Direct Google Calendar Button */}
                      <div>
                        <a
                          href={getGoogleCalendarUrl(
                            `${dl.title} - ${parsedResult.documentTitle}`,
                            dl.date,
                            dl.description || ''
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-white hover:bg-slate-100 text-indigo-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-indigo-200 transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Aggiungi a Google / Apple Calendar</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist Azioni Richieste con Aggiunta/Modifica Manuale */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>Checklist Azioni Concrete (Modificabile)</span>
                </h3>
                <button
                  onClick={handleAddAction}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Aggiungi Task</span>
                </button>
              </div>

              <div className="space-y-2">
                {parsedResult.actions.map((act) => (
                  <div
                    key={act.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      act.completed
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 mr-2">
                      <button
                        onClick={() => handleToggleAction(act.id)}
                        className="text-indigo-600 focus:outline-none shrink-0"
                      >
                        {act.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      {/* Editable Action Text */}
                      <input
                        type="text"
                        value={act.text}
                        onChange={(e) => {
                          const updated = parsedResult.actions.map((a) =>
                            a.id === act.id ? { ...a, text: e.target.value } : a
                          );
                          setParsedResult({ ...parsedResult, actions: updated });
                        }}
                        className={`w-full bg-transparent text-sm focus:outline-none font-medium ${
                          act.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                        {act.category}
                      </span>
                      <button
                        onClick={() => handleRemoveAction(act.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagamenti e Importi */}
            {parsedResult.payments && parsedResult.payments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Pagamenti e Importi PagoPA / Tasse Rilevati</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parsedResult.payments.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl space-y-2 text-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">{p.description}</span>
                        <span className="text-lg font-black text-emerald-700 font-mono">
                          {p.amount}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong>Metodo:</strong> {p.paymentMethod}</div>
                        {p.deadline && <div><strong>Scadenza pagamento:</strong> {p.deadline}</div>}
                        {p.codeOrIban && (
                          <div className="font-mono bg-white p-1.5 rounded border border-emerald-200 text-[11px] break-all">
                            IUV/IBAN: {p.codeOrIban}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documenti e Allegati Necessari */}
            {parsedResult.requiredDocuments && parsedResult.requiredDocuments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Paperclip className="w-4 h-4 text-cyan-600" />
                  <span>Documenti e Allegati Richiesti</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parsedResult.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{doc.name}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded uppercase ${
                            doc.mandatory
                              ? 'bg-red-100 text-red-700 font-extrabold'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {doc.mandatory ? 'Obbligatorio' : 'Opzionale'}
                        </span>
                      </div>
                      {doc.note && <p className="text-slate-500">{doc.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleSaveLedger}
                disabled={savedToLedger}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all inline-flex items-center space-x-2 shadow-sm"
              >
                {savedToLedger ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Aggiunto alla Timeline Scadenze</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Salva Scadenze nel Registro Personale</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJSON}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors inline-flex items-center space-x-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiato!' : 'Copia JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Libretto & Profilo Studente</span>
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-bold block mb-1">Nome Studente:</label>
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Ateneo & Università:</label>
                <input
                  type="text"
                  value={editProfile.university}
                  onChange={(e) => setEditProfile({ ...editProfile, university: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">CFU Acquisiti:</label>
                  <input
                    type="number"
                    value={editProfile.currentCFU}
                    onChange={(e) => setEditProfile({ ...editProfile, currentCFU: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Valore ISEE (€):</label>
                  <input
                    type="number"
                    value={editProfile.iseeValue}
                    onChange={(e) => setEditProfile({ ...editProfile, iseeValue: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Esami Già Superati (separati da virgola):</label>
                <input
                  type="text"
                  value={editProfile.passedExams.join(', ')}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      passedExams: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Salva Profilo Libretto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
