// Gerenciamento de pagamento
let currentPaymentMethod = 'pix';
let paymentCheckInterval;
let pixCode = '';

// Mostra tela de pagamento
function showPayment() {
  document.getElementById('previewScreen').classList.remove('active');
  document.getElementById('paymentScreen').classList.add('active');
  
  // Inicia processo de pagamento PIX
  if (currentPaymentMethod === 'pix') {
    createPixPayment();
  }
}

// Seleciona método de pagamento
function selectPaymentMethod(method) {
  currentPaymentMethod = method;
  
  // Atualiza UI dos botões
  document.querySelectorAll('.payment-method').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.payment-method').classList.add('active');
  
  // Mostra/esconde containers de pagamento
  document.getElementById('pixPayment').style.display = method === 'pix' ? 'block' : 'none';
  document.getElementById('cardPayment').style.display = method === 'card' ? 'block' : 'none';
  
  if (method === 'pix' && !pixCode) {
    createPixPayment();
  }
}

// Cria pagamento PIX via Mercado Pago
async function createPixPayment() {
  try {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 4.00,
        description: 'Relatório Completo - Teste de Q.I. Comportamental',
        payment_method: 'pix',
        user_answers: answers // Envia respostas para vincular ao pagamento
      })
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar pagamento');
    }
    
    const data = await response.json();
    
    // Exibe QR Code
    displayQRCode(data);
    
    // Inicia verificação de pagamento
    startPaymentCheck(data.payment_id);
    
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    showPaymentError('Erro ao gerar pagamento. Tente novamente.');
  }
}

// Exibe QR Code do PIX
function displayQRCode(paymentData) {
  const qrContainer = document.getElementById('qrCodeContainer');
  
  if (paymentData.qr_code_base64) {
    // Exibe imagem do QR Code
    qrContainer.innerHTML = `
      <img src="data:image/png;base64,${paymentData.qr_code_base64}" 
           alt="QR Code PIX" 
           style="max-width: 250px; width: 100%;">
    `;
    
    // Salva código PIX para cópia
    pixCode = paymentData.qr_code;
    
  } else if (paymentData.qr_code) {
    // Gera QR Code no frontend usando biblioteca
    qrContainer.innerHTML = '<div id="qrcode"></div>';
    
    // Você pode usar uma biblioteca como qrcode.js aqui
    // new QRCode(document.getElementById("qrcode"), paymentData.qr_code);
    
    pixCode = paymentData.qr_code;
  }
  
  // Atualiza status
  updatePaymentStatus('waiting', 'Aguardando pagamento...');
}

// Copia código PIX
function copyPixCode() {
  if (!pixCode) {
    alert('Código PIX não disponível');
    return;
  }
  
  navigator.clipboard.writeText(pixCode)
    .then(() => {
      const btn = document.getElementById('copyPixBtn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Copiado!';
      btn.style.background = '#27ae60';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    })
    .catch(err => {
      console.error('Erro ao copiar:', err);
      
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = pixCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      alert('Código PIX copiado!');
    });
}

// Verifica status do pagamento periodicamente
function startPaymentCheck(paymentId) {
  // Limpa intervalo anterior se existir
  if (paymentCheckInterval) {
    clearInterval(paymentCheckInterval);
  }
  
  // Verifica a cada 3 segundos
  paymentCheckInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/check-payment/${paymentId}`);
      const data = await response.json();
      
      if (data.status === 'approved') {
        clearInterval(paymentCheckInterval);
        onPaymentSuccess(data);
      } else if (data.status === 'rejected' || data.status === 'cancelled') {
        clearInterval(paymentCheckInterval);
        onPaymentFailed(data);
      }
      
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
    }
  }, 3000);
  
  // Para de verificar após 15 minutos
  setTimeout(() => {
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
      updatePaymentStatus('expired', 'Pagamento expirado. Tente novamente.');
    }
  }, 15 * 60 * 1000);
}

// Pagamento aprovado
function onPaymentSuccess(paymentData) {
  updatePaymentStatus('success', '✅ Pagamento confirmado!');
  
  // Aguarda 1 segundo e mostra resultado
  setTimeout(() => {
    showResult(paymentData);
  }, 1500);
}

// Pagamento falhou
function onPaymentFailed(paymentData) {
  updatePaymentStatus('error', '❌ Pagamento não aprovado. Tente novamente.');
  
  setTimeout(() => {
    // Opção para tentar novamente
    const statusDiv = document.getElementById('paymentStatus');
    statusDiv.innerHTML += '<br><button class="btn-copy-pix" onclick="createPixPayment()">Tentar Novamente</button>';
  }, 2000);
}

// Atualiza status visual do pagamento
function updatePaymentStatus(type, message) {
  const statusDiv = document.getElementById('paymentStatus');
  statusDiv.textContent = message;
  
  // Remove classes anteriores
  statusDiv.classList.remove('success', 'error', 'warning');
  
  // Adiciona classe apropriada
  if (type === 'success') {
    statusDiv.classList.add('success');
  } else if (type === 'error' || type === 'expired') {
    statusDiv.classList.add('error');
  } else {
    // waiting
    statusDiv.classList.remove('success', 'error');
  }
}

// Mostra erro de pagamento
function showPaymentError(message) {
  const qrContainer = document.getElementById('qrCodeContainer');
  qrContainer.innerHTML = `
    <div style="color: #e74c3c; font-size: 18px; padding: 20px;">
      ${message}
    </div>
  `;
  updatePaymentStatus('error', message);
}

// Webhook handler (para ser chamado pelo backend quando receber notificação do Mercado Pago)
function handleWebhookNotification(notificationData) {
  // Esta função seria chamada via WebSocket ou polling
  // quando o backend recebe notificação do Mercado Pago
  
  if (notificationData.status === 'approved') {
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
    }
    onPaymentSuccess(notificationData);
  }
}

// Cleanup quando usuário sai da página
window.addEventListener('beforeunload', () => {
  if (paymentCheckInterval) {
    clearInterval(paymentCheckInterval);
  }
});