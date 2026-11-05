export interface PersonaData {
  id: string;
  name: string;
  category: "estetica" | "gastronomia" | "servicos" | "saude" | "geral";
  role: string;
  count?: number;
  avgAge?: number;
  genderPct?: string;
  topInterests: { label: string; pct: number }[];
  topGoals: { label: string; pct: number }[];
  keyPain: string;
  tone: string;
  suggestedFormats: string[];
}

export interface BusinessUpdate {
  id: string;
  type: "promocao" | "lancamento" | "dica" | "aviso" | "institucional";
  title: string;
  category: string;
  dateOrTime?: string;
  summary: string;
}

export interface PitchContent {
  id: string;
  version: number;
  createdAt: string;
  personaId: string;
  personaName: string;
  updateTitle?: string;
  initialIdea?: string;
  channel: "instagram" | "linkedin" | "whatsapp" | "tiktok";
  mote: string;
  headlineArte: string;
  headlineArteAlt?: string;
  legenda: string;
  formato: string;
  justificativaFormato: string;
  previousVersions?: {
    version: number;
    mote: string;
    headlineArte: string;
    legenda: string;
    formato: string;
    changeNote: string;
  }[];
}

export const INITIAL_PERSONAS: PersonaData[] = [
  {
    id: "p1",
    name: "Mariana — Paciente de Estética & Autocuidado",
    category: "estetica",
    role: "Profissional liberal que busca procedimentos naturais e sem dor",
    avgAge: 32,
    genderPct: "80% Feminino | 20% Masculino",
    topInterests: [
      { label: "Harmonização Natural", pct: 85 },
      { label: "Clareamento Dental", pct: 78 },
      { label: "Autocuidado & Bem-Estar", pct: 72 }
    ],
    topGoals: [
      { label: "Sorriso confiável para reuniões", pct: 82 },
      { label: "Procedimento rápido sem afastamento", pct: 75 }
    ],
    keyPain: "Medo de dor durante o procedimento e de ficar com resultado artificial.",
    tone: "Acolhedor, elegante, profissional e empático.",
    suggestedFormats: ["Carrossel Antes & Depois", "Reels Curto Explicativo", "Card de Dúvida Frequente"]
  },
  {
    id: "p2",
    name: "Bruno — O Amante de Hambúrguer & Happy Hour",
    category: "gastronomia",
    role: "Jovem adulto que curte sair com amigos e busca comer bem sem gastar fortuna",
    avgAge: 26,
    genderPct: "55% Masculino | 45% Feminino",
    topInterests: [
      { label: "Hambúrguer Artesanal", pct: 92 },
      { label: "Chopp & Cervejas Locais", pct: 81 },
      { label: "Promoções de Happy Hour", pct: 76 }
    ],
    topGoals: [
      { label: "Encontrar a galera no pós-trabalho", pct: 88 },
      { label: "Comida saborosa e rápida", pct: 84 }
    ],
    keyPain: "Lugares cheios com atendimento demorado ou lanche que chega frio no delivery.",
    tone: "Descontraído, bem-humorado, apetitoso e direto ao ponto.",
    suggestedFormats: ["Vídeo Close no Queijo Derretendo", "Meme de Sexta-feira", "Stories com Enquete"]
  },
  {
    id: "p3",
    name: "Dr. Marcos — Dono de PME / Gestor de Negócios",
    category: "servicos",
    role: "Empresário local buscando consultoria contábil ou jurídica segura",
    avgAge: 42,
    genderPct: "60% Masculino | 40% Feminino",
    topInterests: [
      { label: "Redução de Impostos Legais", pct: 89 },
      { label: "Segurança Trabalhista", pct: 82 },
      { label: "Crescimento de Faturamento", pct: 74 }
    ],
    topGoals: [
      { label: "Evitar processos e multas fiscais", pct: 91 },
      { label: "Otimizar tempo de gestão", pct: 80 }
    ],
    keyPain: "Falta de tempo para burocracias e medo de ser pego pela Receita Federal.",
    tone: "Sóbrio, executivo, focado em segurança e autoridade.",
    suggestedFormats: ["Artigo LinkedIn", "Carrossel Explicativo de Leis", "Vídeo de Alerta Rápido"]
  },
  {
    id: "p4",
    name: "Fernanda — Aluna de Pilates & Saúde",
    category: "saude",
    role: "Mulher ativa que quer aliviar dores nas costas e ter mais energia no dia a dia",
    avgAge: 38,
    genderPct: "85% Feminino | 15% Masculino",
    topInterests: [
      { label: "Alívio de Dores na Coluna", pct: 94 },
      { label: "Postura & Flexibilidade", pct: 86 },
      { label: "Saúde Mental & Respiração", pct: 79 }
    ],
    topGoals: [
      { label: "Trabalhar sem dor nas costas", pct: 93 },
      { label: "Momento só dela na semana", pct: 85 }
    ],
    keyPain: "Falta de tempo para academia tradicional e medo de lesões em exercícios pesados.",
    tone: "Inspirador, cuidadoso, acolhedor e focado em saúde integral.",
    suggestedFormats: ["Reels com 3 Alongamentos Rápidos", "Depoimento de Aluna", "Card de Conscientização"]
  }
];

export const INITIAL_UPDATES: BusinessUpdate[] = [
  {
    id: "u1",
    type: "lancamento",
    title: "Novo Equipamento a Laser / Tecnologia de Ponta",
    category: "Novidade",
    summary: "Chegada de tecnologia que reduz o tempo de atendimento pela metade e oferece mais conforto ao cliente."
  },
  {
    id: "u2",
    type: "promocao",
    title: "Condição Especial de Agendamento da Semana",
    category: "Oferta",
    summary: "Campanha especial para os primeiros 10 clientes que chamarem no WhatsApp até sexta-feira."
  },
  {
    id: "u3",
    type: "dica",
    title: "Dica Prática de Rotina que Todo Cliente Deveria Saber",
    category: "Conteúdo Educativo",
    summary: "Explicação simples de um erro comum que 80% dos clientes cometem e como resolver sem gastar nada."
  }
];

export const INITIAL_PITCHES: PitchContent[] = [
  {
    id: "demo-pitch-1",
    version: 1,
    createdAt: new Date().toLocaleDateString("pt-BR"),
    personaId: "p1",
    personaName: "Mariana (Estética & Autocuidado)",
    updateTitle: "Novo Clareamento a Laser",
    initialIdea: "Mostrar que clareamento não precisa causar dor nem sensibilidade",
    channel: "instagram",
    mote: "Quebra de Objeção: desmistificar o medo de sensibilidade no clareamento dental conectando com o desejo de um sorriso brilhante para momentos importantes.",
    headlineArte: "Você ainda foge do clareamento por medo da dor? ✨",
    headlineArteAlt: "O que ninguém te contou sobre a nova tecnologia de clareamento sem sensibilidade.",
    legenda: "A verdade é que a odontologia evoluiu — e você não precisa mais sofrer para ter o sorriso dos seus sonhos! 🦷✨\n\nCom a nossa nova tecnologia de aplicação a laser, você conquista até 4 tons mais brancos com máximo conforto e sem aquela sensibilidade chata que impedia você de tomar um café ou sorvete.\n\n📲 Toque no link da bio e agende sua avaliação pelo WhatsApp com a nossa equipe!\n\n#OdontologiaModerna #SorrisoPerfeito #ClareamentoSemDor #AutoEstima",
    formato: "Carrossel Educativo (3 Lâminas)",
    justificativaFormato: "O formato de carrossel permite conduzir a paciente do medo ('vai doer?') até a solução prática, aumentando a taxa de salvamentos e cliques para o WhatsApp."
  }
];

// Alias para manter compatibilidade com componentes existentes durante a transição
export type FestivalUpdate = BusinessUpdate;
