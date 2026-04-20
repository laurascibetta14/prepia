export const config = { api: { bodyParser: false } }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)
    const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': req.headers['content-type'] },
      body: buffer,
    })
    if (!r.ok) return res.status(500).json({ error: 'Groq error' })
    return res.status(200).json({ text: (await r.text()).trim() })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
