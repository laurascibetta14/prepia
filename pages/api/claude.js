export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { system, messages } = req.body
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [{ role: 'system', content: system }, ...messages],
      }),
    })
    const d = await r.json()
    if (d.error) return res.status(500).json({ error: d.error.message })
    return res.status(200).json({ text: d.choices?.[0]?.message?.content || '' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
