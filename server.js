// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Rota de quiz
app.post('/api/quiz', (req, res) => {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: 'Nenhuma resposta enviada.' });

  const score = answers.filter(a => a.correct).length;
  res.json({ score });
});

// Rota de pagamento
app.post('/api/payment', (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'Valor inválido.' });

  const confirmation = `Pagamento de R$${amount} confirmado com sucesso!`;
  res.json({ confirmation });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
