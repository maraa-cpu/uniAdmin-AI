# uniAdmin-AI

> **Assistente Personale Intelligente basato su IA per la Gestione di Documenti Universitari, Burocrazia, Scadenze e Pagamenti.**

uniAdmin AI è un'applicazione web full-stack sviluppata in **React**, **TypeScript**, **Tailwind CSS** e **Node.js Express**, alimentata dalle API di **Google Gemini 3.6 Flash**. È pensata su misura per studenti universitari (fuorisede e non) per trasformare comunicazioni burocratiche complesse, avvisi della segreteria, email dei docenti, bandi di concorso e bollettini in scadenze chiare, avvisi PagoPA e checklist operative.

---

## 🌟 Caratteristiche Principali

- 📄 **Analisi Multimodale AI (Text & PDF/OCR)**: Incolla avvisi Esse3/SmartEdu o carica PDF (bandi ESU/EDISU, contratti d'affitto, solleciti tasse).
- 🎓 **Cross-Check Libretto & Requisiti CFU**: L'AI confronta automaticamente i requisiti di CFU, propedeuticità ed esami del bando con il libretto universitario dello studente, verificando l'idoneità in tempo reale.
- 💳 **Rilevamento PagoPA & Tasse**: Estrazione automatica di importi (€), scadenze e codici IUV/IBAN con calcolo del saldo totale in sospeso.
- 📅 **Gestione Scadenze & Esportazione Calendario**: Generazione di file `.ics` e pulsante diretto *"Aggiungi a Google / Apple Calendar"* con anticipo promemoria personalizzabile (1, 3 o 7 giorni).
- 🛠️ **Dashboard & Timeline Cronologica**: Organizzazione delle attività ordinate per data imminente (*Oggi*, *Prossimi 7 giorni*, *Questo mese*) e filtri per categoria (*Tasse*, *Esami*, *Affitto*, *Borse di Studio*).
- ✍️ **Modificabilità Completa**: Ogni dato estratto dall'AI (titoli, date, To-Do, importi) è liberamente modificabile o integrabile dallo studente.
- 🛡️ **Human-in-the-Loop Safeguard**: Avvisi di verifica obbligatoria (*Verification Alerts*) che segnalano eventuali ambiguità nel testo originale per prevenire sanzioni o ritardi.

---

## 🏗️ Architettura e Tecnologie Utilizzate

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React (Icone), Motion (Animazioni).
- **Backend**: Node.js, Express v4, `tsx` (Dev Execution), `esbuild` (Production Bundling).
- **AI Core**: `@google/genai` (SDK ufficiale di Google per **Gemini 3.6 Flash**).
- **Build Tool**: Vite 6.

---

## 🚀 Guida all'Installazione ed Esecuzione Locale

### Prerequisiti
- **Node.js**: Versione 18.0.0 o superiore.
- **Gemini API Key**: Ottenibile gratuitamente su [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clona il Repository o Scarica il Codice
```bash
git clone https://github.com/TUO_USERNAME/life-admin-ai.git
cd life-admin-ai
