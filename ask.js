// Serverless API route to proxy AI requests to OpenAI
// Do NOT expose your OpenAI key to the client.
import fetch from 'node-fetch';

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { query } = req.body || {};
  if(!query) return res.status(400).json({error:'Missing query'});

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if(!OPENAI_KEY) return res.status(500).json({error:'Server misconfigured: missing OPENAI_API_KEY'});

  try{
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Sumi, a sarcastic but helpful campus guide for SRM girls. Keep answers short and friendly.' },
        { role: 'user', content: query }
      ],
      max_tokens: 300,
      temperature: 0.9
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const j = await r.json();
    const answer = j.choices?.[0]?.message?.content || j.error?.message || 'No answer from AI';
    res.status(200).json({ answer });
  }catch(err){
    console.error('AI proxy error', err);
    res.status(500).json({ error: 'AI proxy failed' });
  }
}
