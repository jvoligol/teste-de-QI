// Perguntas baseadas em psicologia comportamental científica
// VERSÃO REDUZIDA: 10 perguntas

const quizData = [
    // PERGUNTA 1
    {
      category: "Abertura Cognitiva",
      question: "Ao se deparar com uma teoria que contradiz suas crenças estabelecidas, você:",
      options: {
        A: "Sente desconforto e prefere manter suas convicções",
        B: "Considera brevemente, mas permanece cético",
        C: "Analisa criticamente ambos os lados antes de decidir",
        D: "Fica intrigado e busca entender profundamente a nova perspectiva",
        E: "Questiona ativamente suas próprias crenças e busca integrar novas ideias"
      },
      dimension: "openness"
    },
    
    // PERGUNTA 2
    {
      category: "Organização Cognitiva",
      question: "Ao iniciar um projeto complexo de longo prazo, você:",
      options: {
        A: "Começa impulsivamente sem planejamento detalhado",
        B: "Define apenas os primeiros passos e improvisa o resto",
        C: "Cria um plano básico com marcos principais",
        D: "Desenvolve um cronograma detalhado com contingências",
        E: "Mapeia todos os passos, dependências e cria sistemas de monitoramento"
      },
      dimension: "conscientiousness"
    },
    
    // PERGUNTA 3
    {
      category: "Processamento Social",
      question: "Após resolver um problema desafiador, você prefere:",
      options: {
        A: "Processar internamente e refinar suas ideias em silêncio",
        B: "Compartilhar seletivamente com uma pessoa de confiança",
        C: "Discutir com um pequeno grupo para validar",
        D: "Apresentar entusiasticamente para vários colegas",
        E: "Busca ativamente feedback de múltiplas fontes e debates"
      },
      dimension: "extraversion"
    },
    
    // PERGUNTA 4
    {
      category: "Cognição Social",
      question: "Em uma negociação onde ambas as partes têm interesses conflitantes:",
      options: {
        A: "Prioriza maximizar seu próprio ganho estrategicamente",
        B: "Busca vantagem mas mantém civilidade",
        C: "Equilibra seus interesses com consideração pelo outro",
        D: "Procura ativamente soluções que beneficiem ambos",
        E: "Frequentemente cede seus interesses pelo bem-estar alheio"
      },
      dimension: "agreeableness"
    },
    
    // PERGUNTA 5
    {
      category: "Regulação Emocional",
      question: "Quando enfrenta múltiplos problemas simultâneos e urgentes:",
      options: {
        A: "Fica paralisado pela ansiedade e sobrecarga",
        B: "Sente forte estresse mas tenta continuar",
        C: "Experimenta tensão mas mantém funcionalidade",
        D: "Permanece calmo e prioriza racionalmente",
        E: "Sente-se energizado e altamente focado"
      },
      dimension: "resilience"
    },
    
    // PERGUNTA 6
    {
      category: "Tomada de Decisão",
      question: "Diante de uma escolha importante com informação incompleta:",
      options: {
        A: "Evita decidir até ter mais certeza",
        B: "Decide baseado em sentimentos e intuição imediata",
        C: "Analisa os dados disponíveis sistematicamente",
        D: "Usa heurísticas baseadas em experiências passadas",
        E: "Aplica análise probabilística e aceita incerteza calculada"
      },
      dimension: "decision_making"
    },
    
    // PERGUNTA 7
    {
      category: "Autoconsciência",
      question: "Quando suas emoções começam a influenciar suas decisões:",
      options: {
        A: "Raramente percebe até depois",
        B: "Nota ocasionalmente, mas tem dificuldade em separar",
        C: "Geralmente identifica e tenta compensar",
        D: "Reconhece em tempo real e ajusta seu processamento",
        E: "Usa conscientemente emoções como dados adicionais na decisão"
      },
      dimension: "emotional_awareness"
    },
    
    // PERGUNTA 8
    {
      category: "Flexibilidade Cognitiva",
      question: "Quando percebe que sua estratégia inicial não está funcionando:",
      options: {
        A: "Persiste obstinadamente na mesma abordagem",
        B: "Continua com pequenas modificações superficiais",
        C: "Tenta algumas variações antes de mudar radicalmente",
        D: "Rapidamente pivota para abordagem completamente diferente",
        E: "Mantém múltiplas estratégias em paralelo desde o início"
      },
      dimension: "cognitive_flexibility"
    },
    
    // PERGUNTA 9
    {
      category: "Pensamento Crítico",
      question: "Ao encontrar um estudo que apoia suas crenças:",
      options: {
        A: "Aceita imediatamente como validação",
        B: "Verifica apenas se a fonte parece confiável",
        C: "Examina metodologia básica e tamanho de amostra",
        D: "Analisa criticamente vieses, confounders e limitações",
        E: "Contextualiza em literatura mais ampla e busca meta-análises"
      },
      dimension: "critical_thinking"
    },
    
    // PERGUNTA 10
    {
      category: "Resiliência Cognitiva",
      question: "Após um erro significativo que afeta outras pessoas:",
      options: {
        A: "Rumina excessivamente e tem dificuldade em seguir em frente",
        B: "Sente culpa prolongada e questiona suas capacidades",
        C: "Reconhece o erro, sente desconforto, mas gradualmente processa",
        D: "Aprende rapidamente com o erro e ajusta comportamento",
        E: "Analisa objetivamente, extrai lições e segue com confiança"
      },
      dimension: "resilience"
    }
  ];
  
  // Mapeamento de scores para perfis
  const profileMapping = {
    creative_high_open: {
      name: "Inovador Abstrato",
      qi_range: [130, 145],
      emoji: "🌟",
      description: "Você possui uma capacidade excepcional de pensamento abstrato e criativo. Seu cérebro naturalmente identifica padrões complexos e gera soluções inovadoras."
    },
    analytical_high_conscious: {
      name: "Estrategista Sistemático",
      qi_range: [125, 140],
      emoji: "🎯",
      description: "Seu perfil combina análise profunda com execução disciplinada. Você decompõe problemas complexos em componentes manejáveis e constrói sistemas robustos."
    },
    flexible_adaptive: {
      name: "Pensador Adaptativo",
      qi_range: [120, 135],
      emoji: "🔄",
      description: "Você se destaca em ambientes dinâmicos e incertos. Sua flexibilidade cognitiva permite pivôs rápidos e integração de novas informações."
    },
    emotionally_intelligent: {
      name: "Integrador Emocional-Racional",
      qi_range: [115, 130],
      emoji: "💡",
      description: "Você equilibra sofisticadamente análise racional com inteligência emocional. Consegue ler contextos sociais complexos enquanto mantém raciocínio analítico."
    },
    methodical_learner: {
      name: "Aprendiz Metódico",
      qi_range: [105, 120],
      emoji: "📚",
      description: "Você aprende de forma estruturada e sistemática. Sua abordagem disciplinada garante aprendizado profundo e retenção sólida."
    },
    practical_thinker: {
      name: "Pragmático Eficiente",
      qi_range: [95, 110],
      emoji: "⚙️",
      description: "Você foca em soluções práticas e implementáveis. Sua força está em aplicar conhecimento de forma eficaz em situações reais."
    },
    intuitive_processor: {
      name: "Processador Intuitivo",
      qi_range: [90, 105],
      emoji: "🎭",
      description: "Você processa informações primariamente através de intuição e experiência. Suas decisões são guiadas por padrões reconhecidos inconscientemente."
    },
    developing_potential: {
      name: "Potencial em Desenvolvimento",
      qi_range: [80, 95],
      emoji: "🌱",
      description: "Você está em fase de desenvolvimento de suas habilidades cognitivas. Com prática deliberada, você pode expandir significativamente suas capacidades."
    }
  };