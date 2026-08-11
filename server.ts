import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client to prevent crash on startup if missing API key
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Parse document / email endpoint
app.post('/api/parse-document', async (req, res) => {
  try {
    const { contentText, fileData, mimeType, customContext, studentProfile } = req.body;

    if (!contentText && !fileData) {
      return res.status(400).json({ error: 'Fornisci del testo o un file da analizzare.' });
    }

    const ai = getGenAI();

    const systemInstruction = `Sei Life Admin AI / UniAdmin AI, un assistente specializzato nell'analisi di documenti amministrativi, email e comunicazioni universitarie e burocratiche (Segreteria Studenti, Esse3, PagoPA, ESU/EDISU, contratti di affitto, mail di docenti).
Il tuo obiettivo è estrarre informazioni strutturate e azionabili con massima accuratezza, riducendo a zero le allucinazioni sulle scadenze critiche e sui pagamenti.

Regole rigorose:
1. Identifica chiaramente il tipo di documento.
2. Estrai tutte le scadenze (date esatte, orari di perentorietà se indicati).
3. Crea un elenco ordinato di azioni concrete (checklist categorizzata) per lo studente.
4. Rileva eventuali importi di pagamento (tasse, bolli, contributi, affitti) con metodi di pagamento (PagoPA, MAV, Bonifico).
5. Elenca TUTTI i documenti necessari da allegare o procurarsi (es. ISEE Universitario, Marca da Bollo, DSU, Documento d'Identità).
6. ANALIZZA PROPEDEUTICITÀ E REQUISITI CFU: Se il documento fa riferimento a requsiti di CFU, voti, esami propedeutici o soglie ISEE, estrai questi dati e confrontali con il profilo dello studente fornitoti. Determina eligibilityStatus: 'ELIGIBLE' se lo studente soddisfa i requisiti, 'INELIGIBLE' se mancano CFU/esami o ISEE troppo alto, o 'NOT_APPLICABLE' se il documento non riguarda requisiti accademici. Spiega in statusMessage la situazione (es. "✅ Hai 42 CFU su 35 richiesti" oppure "⚠️ Ti mancano 6 CFU e l'esame di Matematica 1").
7. Assegna un punteggio di confidenza AI (0-100%).
8. Genera ALERT DI VERIFICA (Verification Alerts): segnala chiaramente allo studente qualsiasi ambiguità nel testo originale dove è OBBLIGATORIO fare una verifica manuale sul portale della segreteria.`;

    const profileSummary = studentProfile
      ? `PROFILO STUDENTE PER CONTROLLO AUTOMATICO LIBRETTO:
- Nome: ${studentProfile.name || 'Studente'}
- Ateneo: ${studentProfile.university || 'Università'}
- Corso: ${studentProfile.course || 'Informatica/Ingegneria'}
- CFU Acquisiti nel Libretto: ${studentProfile.currentCFU ?? 42} CFU
- Valore ISEE Universitario: € ${studentProfile.iseeValue ?? 18500}
- Esami Già Superati: ${(studentProfile.passedExams || []).join(', ') || 'Programmazione 1, Analisi 1, Fisica 1'}`
      : 'Nessun profilo studente fornito.';

    const promptText = `Analizza questa comunicazione/documento universitario o amministrativo.

${profileSummary}

${customContext ? `Contesto aggiuntivo fornito dall'utente/nota contestuale: ${customContext}\n` : ''}
Contenuto da analizzare:
${contentText || 'File allegato.'}`;

    const contentsParts: any[] = [];
    if (fileData && mimeType) {
      contentsParts.push({
        inlineData: {
          data: fileData,
          mimeType: mimeType,
        },
      });
    }
    contentsParts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: contentsParts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTitle: { type: Type.STRING, description: 'Titolo breve e rappresentativo del documento' },
            documentType: { type: Type.STRING, description: 'Es. Bando Borsa di Studio, Sollecito Tasse, Comunicazione Esse3, Contratto Affitto' },
            summary: { type: Type.STRING, description: 'Sintesi di 2 frasi del contenuto essenziale' },
            urgency: { type: Type.STRING, description: 'ALTA | MEDIA | BASSA' },
            deadlines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  date: { type: Type.STRING, description: 'Data esatta o stimata es. 2026-09-15 o 15 Settembre 2026' },
                  time: { type: Type.STRING, description: 'Es. Ore 12:00' },
                  description: { type: Type.STRING },
                  critical: { type: Type.BOOLEAN, description: 'True se comporta penalità o esclusione' },
                },
                required: ['title', 'date', 'critical'],
              },
            },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'PAGAMENTO | COMPILAZIONE | INVIO_DOCUMENTI | PRENOTAZIONE | ALTRO' },
                  completed: { type: Type.BOOLEAN },
                },
                required: ['id', 'text', 'category'],
              },
            },
            payments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  amount: { type: Type.STRING, description: 'Es. 156.00 €' },
                  paymentMethod: { type: Type.STRING, description: 'Es. PagoPA / MAV / Bonifico' },
                  deadline: { type: Type.STRING },
                  codeOrIban: { type: Type.STRING },
                },
                required: ['description', 'amount'],
              },
            },
            requiredDocuments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  mandatory: { type: Type.BOOLEAN },
                  note: { type: Type.STRING },
                },
                required: ['name', 'mandatory'],
              },
            },
            academicRequirements: {
              type: Type.OBJECT,
              properties: {
                requiredCFU: { type: Type.INTEGER },
                requiredExams: { type: Type.ARRAY, items: { type: Type.STRING } },
                maxISEE: { type: Type.NUMBER },
                propedeuticityNote: { type: Type.STRING },
                eligibilityStatus: { type: Type.STRING, description: 'ELIGIBLE | INELIGIBLE | NOT_APPLICABLE' },
                statusMessage: { type: Type.STRING, description: 'Messaggio esplicativo del riscontro libretto' },
              },
            },
            aiConfidenceScore: { type: Type.INTEGER, description: 'Punteggio 0-100' },
            verificationAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Avvisi sui punti ambigui da verificare manualmente',
            },
          },
          required: [
            'documentTitle',
            'documentType',
            'summary',
            'urgency',
            'deadlines',
            'actions',
            'payments',
            'requiredDocuments',
            'aiConfidenceScore',
            'verificationAlerts',
          ],
        },
      },
    });

    const parsedResult = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedResult });
  } catch (error: any) {
    console.error('Errore durante l\'analisi del documento:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Si è verificato un errore durante l\'analisi del documento con Gemini.',
    });
  }
});

// Interactive Pivot & Idea Feasibility Critique AI Endpoint
app.post('/api/critique-idea', async (req, res) => {
  try {
    const { userQuestion, context } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Sei un esperto Product Strategist ed EdTech Venture Architect.
Lo studente universitario sta valutando la sua idea di app "UniAdmin AI" (analizzatore di documenti/email/scadenze universitarie).

Domanda / punto di discussione dello studente: "${userQuestion || 'Valutazione generale del caso d\'uso'}"

Fornisci una risposta schietta, analitica e costruttiva in italiano, suddivisa in:
1. Punti di Forza dell'Idea
2. Rischi e Limiti Critici (Allucinazioni AI, GDPR/Privacy, integrazione con sistemi legacy Esse3/SmartEdu)
3. Suggerimenti di Pivot o Funzionalità più Specifiche per massimizzare l'utilità reale per gli studenti italiani.`,
    });

    return res.json({ success: true, response: response.text });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UniAdmin AI Server] listening on http://0.0.0.0:${PORT}`);
  });
}

main();
