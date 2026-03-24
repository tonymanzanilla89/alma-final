export default async function handler(request, response) {
  // Manejo de CORS manual para Vercel
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(request.body)
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      return response.status(anthropicResponse.status).json({ 
        error: "Anthropic API Error", 
        details: data 
      });
    }

    return response.status(200).json(data);
  } catch (err) {
    return response.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
}