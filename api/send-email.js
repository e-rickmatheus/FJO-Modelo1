// api/send-email.js
// Serverless function to send contact form submissions via Resend

export default async function handler(req, res) {
  // CORS Headers for safety
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltam campos obrigatórios (nome, e-mail e mensagem).' });
  }

  // Get Resend API Key from environment or fallback to user's provided key
  const apiKey = process.env.RESEND_API_KEY || 're_ja4Yvo1c_9sLn8NdLXJuwbZyFzUi9DhKi';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Site Fernando José de Oliveira <onboarding@resend.dev>',
        to: ['adv.mariandrade@gmail.com'], // Send lead to office email
        subject: `Novo Lead do Site: ${subject || 'Contato Geral'}`,
        html: `
          <h3>Novo contato recebido pelo formulário do site</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
          <p><strong>Assunto:</strong> ${subject || 'Não informado'}</p>
          <br/>
          <p><strong>Mensagem:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; font-family: sans-serif; color: #334155; line-height: 1.5;">${message}</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error response:', data);
      return res.status(response.status).json({ error: data.message || 'Erro ao enviar e-mail via Resend.' });
    }

    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Server error in api/send-email:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
