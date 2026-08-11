export interface DeadlineItem {
  id?: string;
  title: string;
  date: string;
  time?: string;
  description: string;
  critical: boolean;
  reminderLeadDays?: number; // Days before to remind: 1, 3, 7
}

export interface ActionItem {
  id: string;
  text: string;
  category: 'PAGAMENTO' | 'COMPILAZIONE' | 'INVIO_DOCUMENTI' | 'PRENOTAZIONE' | 'ALTRO';
  completed: boolean;
}

export interface PaymentItem {
  id?: string;
  description: string;
  amount: string;
  paymentMethod: string;
  deadline?: string;
  codeOrIban?: string;
}

export interface RequiredDocument {
  id?: string;
  name: string;
  mandatory: boolean;
  note?: string;
}

export interface AcademicRequirementsCheck {
  requiredCFU?: number;
  requiredExams?: string[];
  maxISEE?: number;
  propedeuticityNote?: string;
  eligibilityStatus?: 'ELIGIBLE' | 'INELIGIBLE' | 'NOT_APPLICABLE';
  statusMessage?: string;
}

export interface StudentProfile {
  name: string;
  university: string;
  course: string;
  currentCFU: number;
  iseeValue: number;
  passedExams: string[];
}

export interface ParsedDocumentResult {
  documentTitle: string;
  documentType: string;
  summary: string;
  urgency: 'ALTA' | 'MEDIA' | 'BASSA';
  deadlines: DeadlineItem[];
  actions: ActionItem[];
  payments: PaymentItem[];
  requiredDocuments: RequiredDocument[];
  academicRequirements?: AcademicRequirementsCheck;
  aiConfidenceScore: number;
  verificationAlerts: string[];
}

export interface SampleDocument {
  id: string;
  title: string;
  type: string;
  iconName: string;
  preview: string;
  fullText: string;
}

export interface IdeaPivotOption {
  id: string;
  title: string;
  tagline: string;
  description: string;
  pros: string[];
  cons: string[];
  targetUser: string;
  aiFeasibilityScore: number;
  keyFeature: string;
}

