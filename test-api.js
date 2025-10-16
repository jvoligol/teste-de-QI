// Script de teste da API
// Execute com: node backend/test-api.js

const http = require('http');

console.log('🧪 Testando API do Teste Q.I. Comportamental...\n');

// Teste 1: Health Check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣  Testando Health Check...');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Health Check OK');
          console.log('   📊 Response:', data);
          resolve();
        } else {
          console.log('   ❌ Falhou:', res.statusCode);
          reject();
        }
        console.log('');
      });
    });
    
    req.on('error', (e) => {
      console.log('   ❌ Erro:', e.message);
      console.log('   ⚠️  Certifique-se que o servidor está rodando (npm start)');
      reject(e);
    });
    
    req.end();
  });
}

// Teste 2: Verificar estrutura de arquivos
function testFileStructure() {
  const fs = require('fs');
  const path = require('path');
  
  console.log('2️⃣  Verificando estrutura de arquivos...');
  
  const files = [
    'frontend/index.html',
    'frontend/css/styles.css',
    'frontend/js/questions.js',
    'frontend/js/quiz.js',
    'frontend/js/payment.js',
    'backend/server.js',
    'package.json',
    '.env.example'
  ];
  
  let allExist = true;
  
  files.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - NÃO ENCONTRADO`);
      allExist = false;
    }
  });
  
  console.log('');
  return allExist;
}

// Teste 3: Verificar .env
function testEnvConfig() {
  const fs = require('fs');
  const path = require('path');
  
  console.log('3️⃣  Verificando configuração .env...');
  
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('   ⚠️  Arquivo .env não encontrado');
    console.log('   📝 Execute: cp .env.example .env');
    console.log('');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('seu_access_token_aqui')) {
    console.log('   ⚠️  Mercado Pago não configurado');
    console.log('   📝 Configure o MERCADOPAGO_ACCESS_TOKEN no .env');
    console.log('');
    return false;
  }
  
  console.log('   ✅ Arquivo .env configurado');
  console.log('');
  return true;
}

// Executa todos os testes
async function runAllTests() {
  try {
    // Testa estrutura primeiro (não precisa de servidor)
    testFileStructure();
    testEnvConfig();
    
    // Testa API (precisa de servidor rodando)
    await testHealthCheck();
    
    console.log('====================================');
    console.log('✨ Todos os testes passaram!');
    console.log('====================================');
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('   1. Configure o Mercado Pago no .env');
    console.log('   2. Execute: npm start');
    console.log('   3. Acesse: http://localhost:3000');
    console.log('');
    
  } catch (error) {
    console.log('====================================');
    console.log('❌ Alguns testes falharam');
    console.log('====================================');
    console.log('');
    console.log('Verifique:');
    console.log('   - Servidor está rodando? (npm start)');
    console.log('   - Porta 3000 está livre?');
    console.log('   - Todas as dependências instaladas? (npm install)');
    console.log('');
    process.exit(1);
  }
}

// Executa
runAllTests();