// Variáveis globais do quiz
let currentQuestion = 0;
let answers = [];
let dimensionScores = {};
let timer;
let timeLeft = 45;
let startTime;
let questionTimes = [];

// Inicializa dimensões
function initializeDimensions() {
  const dimensions = [
    'openness', 'creativity', 'conscientiousness', 'self_control',
    'extraversion', 'stimulation', 'agreeableness', 'empathy',
    'neuroticism', 'resilience', 'learning_style', 'decision_making',
    'emotional_awareness', 'impulse_control', 'metacognition', 'epistemic_humility',
    'cognitive_flexibility', 'dialectical_thinking', 'abstract_thinking', 'systems_thinking',
    'processing_speed', 'working_memory', 'critical_thinking', 'logical_reasoning',
    'creative_problem_solving', 'counterfactual_thinking'
  ];
  
  dimensions.forEach(dim => {
    dimensionScores[dim] = 0;
  });
}

// Inicia o quiz
function startQuiz() {
  initializeDimensions();
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.add('active');
  startTime = Date.now();
  showQuestion();
}

// Mostra a questão atual
function showQuestion() {
  if (currentQuestion >= quizData.length) {
    showPreview();
    return;
  }

  const question = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  
  // Atualiza UI
  document.getElementById('currentQ').textContent = currentQuestion + 1;
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('questionCategory').textContent = question.category;
  document.getElementById('questionText').textContent = question.question;
  
  // Cria opções
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';
  
  Object.entries(question.options).forEach(([key, value]) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = value;
    btn.onclick = () => selectOption(btn, key, question.dimension);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('btnNext').classList.remove('show');
  startTimer();
}

// Seleciona uma opção
function selectOption(btn, optionKey, dimension) {
  clearInterval(timer);
  
  // Registra tempo da resposta
  const questionTime = 45 - timeLeft;
  questionTimes.push(questionTime);
  
  // Desabilita todas as opções
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => {
    b.classList.add('disabled');
    b.classList.remove('selected');
  });
  
  btn.classList.add('selected');
  
  // Calcula score baseado na opção (A=1, B=2, C=3, D=4, E=5)
  const scoreMap = { A: 1, B: 2, C: 3, D: 4, E: 5 };
  const score = scoreMap[optionKey];
  
  // Registra resposta
  answers.push({
    question: currentQuestion,
    option: optionKey,
    score: score,
    dimension: dimension,
    time: questionTime
  });
  
  // Adiciona ao score da dimensão
  if (dimension && dimensionScores.hasOwnProperty(dimension)) {
    dimensionScores[dimension] += score;
  }
  
  document.getElementById('btnNext').classList.add('show');
}

// Timer da questão
function startTimer() {
  timeLeft = 45;
  const timerDisplay = document.getElementById('timerDisplay');
  const timerCount = document.getElementById('timerCount');
  
  timerDisplay.classList.remove('warning');
  timerCount.textContent = timeLeft;
  
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerCount.textContent = timeLeft;
    
    if (timeLeft <= 15) {
      timerDisplay.classList.add('warning');
    }
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      // Auto-avança para próxima questão se o tempo acabar
      autoSelectOption();
    }
  }, 1000);
}

// Seleciona opção automaticamente quando tempo acaba
function autoSelectOption() {
  const question = quizData[currentQuestion];
  const optionC = 'C'; // Opção neutra/média
  
  answers.push({
    question: currentQuestion,
    option: optionC,
    score: 3,
    dimension: question.dimension,
    time: 45,
    autoSelected: true
  });
  
  if (question.dimension && dimensionScores.hasOwnProperty(question.dimension)) {
    dimensionScores[question.dimension] += 3;
  }
  
  nextQuestion();
}

// Próxima questão
function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

// Mostra preview antes do pagamento
function showPreview() {
  clearInterval(timer);
  document.getElementById('quizScreen').classList.remove('active');
  document.getElementById('previewScreen').classList.add('active');
  
  // Calcula estatísticas
  const totalTime = Date.now() - startTime;
  const avgTime = Math.round(questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length);
  const completionRate = Math.round((answers.filter(a => !a.autoSelected).length / quizData.length) * 100);
  
  document.getElementById('avgTime').textContent = avgTime + 's';
  document.getElementById('completionRate').textContent = completionRate + '%';
}

// Calcula perfil e QI
function calculateProfile() {
  // Normaliza scores (0-100)
  const normalizedScores = {};
  Object.keys(dimensionScores).forEach(dim => {
    const maxPossible = 5 * quizData.filter(q => q.dimension === dim).length;
    normalizedScores[dim] = maxPossible > 0 ? (dimensionScores[dim] / maxPossible) * 100 : 0;
  });
  
  // Identifica dimensões dominantes
  const sortedDimensions = Object.entries(normalizedScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  // Calcula QI base (85-145)
  const avgScore = sortedDimensions.reduce((sum, [, score]) => sum + score, 0) / 5;
  const baseQI = 85 + (avgScore * 0.6);
  
  // Ajustes baseados em padrões específicos
  let qiAdjustment = 0;
  
  // Bônus para alta conscienciosidade + pensamento crítico
  if (normalizedScores.conscientiousness > 75 && normalizedScores.critical_thinking > 75) {
    qiAdjustment += 5;
  }
  
  // Bônus para flexibilidade cognitiva + abertura
  if (normalizedScores.cognitive_flexibility > 70 && normalizedScores.openness > 70) {
    qiAdjustment += 5;
  }
  
  const finalQI = Math.round(Math.min(145, Math.max(80, baseQI + qiAdjustment)));
  
  // Determina perfil
  let profile = determineProfile(normalizedScores, finalQI);
  
  return {
    qi: finalQI,
    profile: profile,
    dimensions: normalizedScores,
    topDimensions: sortedDimensions
  };
}

// Determina perfil baseado em scores
function determineProfile(scores, qi) {
  // Lógica para determinar perfil baseado em combinações de dimensões
  
  if (scores.openness > 75 && scores.cognitive_flexibility > 75) {
    return profileMapping.creative_high_open;
  }
  
  if (scores.conscientiousness > 75 && scores.critical_thinking > 70) {
    return profileMapping.analytical_high_conscious;
  }
  
  if (scores.cognitive_flexibility > 75 && scores.decision_making > 70) {
    return profileMapping.flexible_adaptive;
  }
  
  if (scores.emotional_awareness > 70 && scores.agreeableness > 70) {
    return profileMapping.emotionally_intelligent;
  }
  
  if (scores.conscientiousness > 65) {
    return profileMapping.methodical_learner;
  }
  
  if (qi >= 110) {
    return profileMapping.analytical_high_conscious;
  } else if (qi >= 95) {
    return profileMapping.practical_thinker;
  } else if (qi >= 85) {
    return profileMapping.intuitive_processor;
  } else {
    return profileMapping.developing_potential;
  }
}

// Mostra resultado final (após pagamento)
function showResult(paymentData) {
  document.getElementById('paymentScreen').classList.remove('active');
  document.getElementById('resultScreen').classList.add('active');
  
  const result = calculateProfile();
  
  // Ajusta QI baseado no range do perfil
  const [minQI, maxQI] = result.profile.qi_range;
  const adjustedQI = Math.round((result.qi - 80) / 65 * (maxQI - minQI) + minQI);
  
  document.getElementById('resultEmoji').textContent = result.profile.emoji;
  document.getElementById('resultProfile').textContent = result.profile.name;
  document.getElementById('resultDescription').textContent = result.profile.description;
  
  animateQI(adjustedQI);
  
  // Mostra análise detalhada dos Big Five
  showBigFiveAnalysis(result.dimensions);
  
  // Salva resultado no servidor
  saveResult(paymentData, result, adjustedQI);
}

// Anima o número do QI
function animateQI(targetQI) {
  let current = 0;
  const increment = targetQI / 60;
  const qiElement = document.getElementById('qiNumber');
  
  const animation = setInterval(() => {
    current += increment;
    if (current >= targetQI) {
      current = targetQI;
      clearInterval(animation);
    }
    qiElement.textContent = Math.round(current);
  }, 25);
}

// Mostra análise detalhada dos 5 fatores
function showBigFiveAnalysis(dimensions) {
  const bigFive = [
    { 
      name: 'Abertura à Experiência', 
      dimensions: ['openness', 'creativity'],
      description: 'Curiosidade intelectual e apreciação por novidades'
    },
    { 
      name: 'Conscienciosidade', 
      dimensions: ['conscientiousness', 'self_control'],
      description: 'Organização, disciplina e orientação para objetivos'
    },
    { 
      name: 'Extroversão', 
      dimensions: ['extraversion', 'stimulation'],
      description: 'Sociabilidade e busca por estimulação'
    },
    { 
      name: 'Amabilidade', 
      dimensions: ['agreeableness', 'empathy'],
      description: 'Cooperação, empatia e consideração pelos outros'
    },
    { 
      name: 'Estabilidade Emocional', 
      dimensions: ['resilience'],
      description: 'Controle emocional e resiliência ao estresse',
      invert: true
    }
  ];
  
  const analysisContainer = document.getElementById('bigFiveAnalysis');
  analysisContainer.innerHTML = '';
  
  bigFive.forEach(factor => {
    // Calcula média das dimensões relacionadas
    let avgScore = 0;
    let count = 0;
    factor.dimensions.forEach(dim => {
      if (dimensions[dim] !== undefined) {
        avgScore += factor.invert ? (100 - dimensions[dim]) : dimensions[dim];
        count++;
      }
    });
    avgScore = count > 0 ? avgScore / count : 0;
    
    const factorDiv = document.createElement('div');
    factorDiv.className = 'factor-item';
    factorDiv.innerHTML = `
      <div class="factor-name">
        ${factor.name}
        <span class="factor-score">${Math.round(avgScore)}%</span>
      </div>
      <div class="factor-bar">
        <div class="factor-bar-fill" style="width: 0%"></div>
      </div>
      <div class="factor-description">${factor.description}</div>
    `;
    analysisContainer.appendChild(factorDiv);
    
    // Anima barra
    setTimeout(() => {
      factorDiv.querySelector('.factor-bar-fill').style.width = avgScore + '%';
    }, 100);
  });
}

// Salva resultado no servidor
function saveResult(paymentData, result, qi) {
  fetch('/api/save-result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payment_id: paymentData.payment_id,
      qi: qi,
      profile: result.profile.name,
      dimensions: result.dimensions,
      answers: answers,
      timestamp: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Resultado salvo:', data);
  })
  .catch(error => {
    console.error('Erro ao salvar resultado:', error);
  });
}

// Volta para preview
function backToPreview() {
  document.getElementById('paymentScreen').classList.remove('active');
  document.getElementById('previewScreen').classList.add('active');
}

// Reinicia o quiz
function restartQuiz() {
  currentQuestion = 0;
  answers = [];
  questionTimes = [];
  initializeDimensions();
  
  document.getElementById('resultScreen').classList.remove('active');
  document.getElementById('startScreen').classList.remove('hidden');
}