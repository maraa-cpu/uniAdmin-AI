import { SampleDocument, IdeaPivotOption } from '../types';

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'bando-borsa-studio',
    title: 'Bando Borsa di Studio & Alloggio 2026/2027',
    type: 'Bando Concorso ESU/EDISU',
    iconName: 'GraduationCap',
    preview: 'Bando di concorso per l\'assegnazione di borse di studio ed alloggi per gli studenti universitari...',
    fullText: `UNIVERSITÀ DEGLI STUDI - AZIENDA REGIONALE PER IL DIRITTO ALLO STUDIO (ESU/EDISU)
BANDO DI CONCORSO PER L'ASSEGNAZIONE DI BORSE DI STUDIO E ALLOGGI - A.A. 2026/2027

ART. 1 - REQUISITI E SCADENZE
1.1 La domanda di partecipazione deve essere presentata esclusivamente online tramite il Portale Studenti entro e non oltre le ore 12:00 del 15 Settembre 2026, pena l'esclusione irrevocabile.
1.2 Per accedere al concorso è necessario possedere l'Attestazione ISEE per le Prestazioni Agevolate per il Diritto allo Studio Universitario sottoscritta entro il 31 Agosto 2026. L'indicatore ISEE non deve superare € 25.500,00 e l'ISPE non deve superare € 52.000,00.

ART. 2 - DOCUMENTAZIONE OBBLIGATORIA DA ALLEGARE
- Copia del documento di identità in corso di validità (PDF).
- Copia della DSU sottoscritta o numero di protocollo INPS dell'ISEE Universitario.
- Per gli studenti fuorisede: ricevuta di registrazione del contratto di locazione presso l'Agenzia delle Entrate (durata minima 10 mesi), da caricare sul portale entro il 15 Ottobre 2026.

ART. 3 - IMPORTI E PAGAMENTO TASSE
Gli studenti vincitori di borsa di studio sono esonerati dal pagamento della tassa d'ateneo. Resta dovuto il pagamento della Tassa Regionale per il Diritto allo Studio pari a € 140,00 tramite PagoPA entro il 30 Settembre 2026.

ATTENZIONE: Gli studenti al secondo anno o successivi devono aver maturato almeno 35 CFU entro il 10 Agosto 2026.`,
  },
  {
    id: 'sollecito-tasse',
    title: 'Sollecito 2ª Rata Tasse e Contributi Universitari',
    type: 'Comunicazione Amministrativa Segreteria',
    iconName: 'CreditCard',
    preview: 'Avviso di scadenza imminente per il versamento della seconda rata del contributo onnicomprensivo...',
    fullText: `OGGETTO: Sollecito di pagamento 2ª Rata Tasse e Contributi Universitari A.A. 2025/2026 - Matricola 884920

Gentile Studente/ssa,
le ricordiamo che il termine ultimo per il versamento della 2ª rata delle tasse universitarie è fissato per il 30 Aprile 2026.

DATI DEL PAGAMENTO:
- Importo dovuto: € 382,50 (comprensivo di quota contributiva in base alla fascia ISEE).
- Modalità di pagamento: Esclusivamente tramite il circuito PagoPA integrato nel Portale Esse3 / SmartEdu.
- Avviso di Pagamento PagoPA Codice IUV: 001293847562019384.

CONSEGUENZE IN CASO DI RITARDO:
Il mancato versamento entro il 30 Aprile 2026 comporterà:
1. L'applicazione di un'indennità di mora pari a € 30,00 per ritardi fino a 30 giorni e € 60,00 per ritardi superiori a 30 giorni.
2. Il blocco immediato della carriera scolastica con impossibilità di prenotare appelli d'esame e verbalizzare esami sostenuti a partire dal 1° Maggio 2026.

Qualora avesse già provveduto al pagamento nelle ultime 48 ore, la preghiamo di ignorare il presente avviso previa verifica dello stato "PAGATO" sul portale Esse3.`,
  },
  {
    id: 'email-docente-progetto',
    title: 'Consegna Progetto Finale & Appello di Luglio',
    type: 'Email Docente / Dipartimento',
    iconName: 'Mail',
    preview: 'Indicazioni per la consegna della relazione di laboratorio e prenotazione appello straordinario...',
    fullText: `Da: Prof. Marco Bianchi <marco.bianchi@unidipartimento.it>
A: Studenti del Corso di Ingegneria del Software
Oggetto: Modalità consegna progetto finale e date appelli esame - Sessione Estiva

Cari studenti,
vi comunico le istruzioni vincolanti per il superamento dell'esame di Ingegneria del Software per l'appello del 18 Luglio 2026.

1. CONSEGNA PROGETTO:
Il codice sorgente (repository GitHub) e la relazione tecnica in formato PDF (max 15 pagine) dovranno essere caricati sulla piattaforma Moodle entro le ore 23:59 del 12 Luglio 2026. Non saranno accettate consegne via email o in ritardo.

2. PRENOTAZIONE ESAME:
È tassativamente obbligatorio prenotarsi su Esse3 entro il 14 Luglio 2026 ore 12:00. Chi non risulta iscritto nella lista Esse3 NON potrà sostenere la prova orale.

3. REQUISITI PER L'ORALE:
Il giorno dell'esame (18 Luglio 2026 ore 09:00 presso l'Aula Magna D):
- Presentarsi muniti di badge universitario e documento d'identità.
- Portare il proprio computer con l'applicazione funzionante in locale per la dimostrazione live.

Cordiali saluti,
Prof. Marco Bianchi`,
  },
  {
    id: 'contratto-locazione',
    title: 'Contratto Affitto Studenti Fuorisede & Detrazione',
    type: 'Contratto Privato / Fiscale',
    iconName: 'FileText',
    preview: 'Contratto di locazione ad uso abitativo per studenti universitari e adempimenti Agenzia delle Entrate...',
    fullText: `CONTRATTO DI LOCAZIONE AD USO ABITATIVO PER STUDENTI UNIVERSITARI
(ai sensi dell'art. 5, comma 2, della Legge 9 dicembre 1998, n. 431)

LOCATORE: Mario Rossi (C.F. RSSMRA70A01H501Z)
CONDUTTORE: Luca Bianchi (C.F. BNCLCU02M15F205K) - Studente iscritto al Corso di Laurea in Informatica

ART. 3 - CANONE E SPESE CONDOMINIALI
Il canone di locazione mensile è pattuito in € 420,00 da versarsi entro il giorno 5 di ogni mese mediante bonifico bancario su IBAN: IT02X0306909606100000012345 intestato al Locatore.
Le spese condominiali forfettarie ammontano a € 50,00 mensili, da versare contestualmente al canone.
Deposito cauzionale: € 840,00 (pari a due mensilità) versato alla firma.

ART. 8 - REGISTRAZIONE E DETRAZIONE FISCALE PER LO STUDENTE
Il locatore provvederà alla registrazione del contratto presso l'Agenzia delle Entrate entro 30 giorni dalla firma (entro il 28 Febbraio 2026).
Lo studente conduttore potrà fruire della detrazione IRPEF del 19% sui canoni di locazione (fino a un massimo di spesa di € 2.633,00 all'anno) conservando le ricevute dei bonifici bancari e la copia del contratto registrato da allegare alla Dichiarazione dei Redditi 730 del 2027.`,
  },
];

export const IDEA_PIVOTS: IdeaPivotOption[] = [
  {
    id: 'pivot-sentinel',
    title: '1. UniDeadline & Fee Sentinel',
    tagline: 'Copilot di Scadenze e Tasse a Tolleranza Zero Errore',
    description: 'Invece di tentare di gestire qualsiasi documento generico, l\'app si specializza esclusivamente nel prevenire sanzioni economiche (mora tasse) e perdita di diritti (borse di studio, iscrizione appelli). Funziona con un sistema di verifica "Human-in-the-Loop".',
    pros: [
      'Risolve il dolore a più alto impatto economico e accademico per gli studenti.',
      'Riduce i rischi di responsabilità legale/allucinazione imponendo la confermabilità con 1-click degli alert estratti.',
      'Facile da promuovere nelle community universitarie e rappresentanze studentesche.',
    ],
    cons: [
      'Copre solo una parte dei documenti (tasse, bandi, scadenze d\'esame).',
      'Non sostituisce completamente il portale Esse3.',
    ],
    targetUser: 'Studenti universitari con borse di studio ISEE o carriere con molte scadenze burocratiche.',
    aiFeasibilityScore: 92,
    keyFeature: 'Estrattore ad alta precisione con link diretto di riscontro PagoPA/Esse3 e conteggio della mora potenziale.',
  },
  {
    id: 'pivot-extension',
    title: '2. Mail-to-Action Chrome Extension',
    tagline: 'Assistente Integrato direttamente nella Webmail Universitaria',
    description: 'Nessun caricamento manuale di documenti: l\'estensione per browser rileva quando lo studente apre un\'email della segreteria o di un docente e genera automaticamente un banner con scadenze, eventi iCal e task a margine della mail.',
    pros: [
      'Frizione d\'uso pari a zero: lo studente non deve scaricare PDF e caricarli nell\'app.',
      'Integrazione nativa nel flusso quotidiano (Gmail / Microsoft Outlook universitario).',
      'Aggiunta immediata al Google Calendar con un solo clic.',
    ],
    cons: [
      'Non analizza foto o ricevute cartacee (a meno di inoltrarle via mail).',
      'Richiede lo sviluppo di una browser extension e la gestione dei permessi di lettura mail.',
    ],
    targetUser: 'Studenti che ricevono decine di comunicazioni quotidiane sulla webmail d\'ateneo.',
    aiFeasibilityScore: 88,
    keyFeature: 'Auto-detection dei pattern email (es. [Ateneo], [Esse3], [Prof]) e pulsante "Aggiungi a Google Calendar".',
  },
  {
    id: 'pivot-vault',
    title: '3. Smart Student Vault & Compliance Checker',
    tagline: 'Organizzatore di Documenti con Controllo Requisiti e Burocrazia',
    description: 'Un "caveau" sicuro per tutti i PDF universitari (ISEE, contratti, libretto, ricevute) che controlla la completezza dei fascicoli burocratici per domande di laurea, tirocinio, alloggio o borse di studio.',
    pros: [
      'Valore a lungo termine per l\'intero percorso di studio (dall\'immatricolazione alla laurea).',
      'Utility elevata anche per fuorisede (gestione contratto casa, utenze, 730/detrazioni).',
      'Forte posizionamento di privacy con cifratura locale dei file sensitive.',
    ],
    cons: [
      'Richiede che lo studente carichi e mantenga aggiornata la propria cartella documenti.',
    ],
    targetUser: 'Studenti fuorisede, studenti lavoratori e candidati a borse di studio articolate.',
    aiFeasibilityScore: 85,
    keyFeature: 'Checker di conformità del fascicolo ("Es. Per fare domanda di Laurea ti manca la ricevuta del Bollo da 16€ e la firma del relatore").',
  },
];
