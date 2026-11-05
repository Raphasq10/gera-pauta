/**
 * Tipagens do Modelo Comercial — Gera Pauta (Pequenos Negócios & Agências)
 */

export type SocialNetwork = "instagram" | "linkedin" | "tiktok" | "whatsapp";

export type ContentGoal = 
  | "whatsapp"        // Venda / Agendamento direto
  | "comments"        // Engajamento / Conversas no direct
  | "saves"           // Autoridade / Salvamentos
  | "shares";         // Alcance / Compartilhamentos

export interface BusinessPersona {
  id: string;
  name: string;
  role: string;
  demographics?: string;
  keyPain: string;
  desires?: string;
  objections?: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  companyName: string;
  niche: string;               // Ex: "Odontologia", "Hamburgueria Artesanal", "Advocacia Trabalhista"
  toneOfVoice: string;         // Ex: "Profissional e acolhedor", "Descontraído e jovem", "Direto e executivo"
  differentials?: string;      // O que torna o negócio único
  personas: BusinessPersona[];
  createdAt: string;
  updatedAt: string;
}

export interface PitchContent {
  id: string;
  version: number;
  createdAt: string;
  businessId: string;
  channel: SocialNetwork;
  goal: ContentGoal;
  mote: string;
  headlineArte: string;        // Opção principal (Afirmação de impacto ou gancho)
  headlineArteAlt?: string;     // Opção B alternativa (Pergunta provocativa)
  legenda: string;
  formato: string;
  justificativaFormato: string;
  hashtags?: string[];
  initialIdea?: string;
  history?: Array<{
    version: number;
    updatedAt: string;
    mote: string;
    headlineArte: string;
    legenda: string;
  }>;
}

export interface UserSubscription {
  userId: string;
  plan: "free" | "pro" | "agency";
  status: "active" | "canceled" | "past_due";
  pitchesGeneratedCount: number;
  freePitchesLimit: number; // Padrão: 5
  userApiKey?: string;      // BYOK opcional do Google AI Studio ou OpenAI
}
