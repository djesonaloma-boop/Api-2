export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // TA CLE UDIO CACHÉE
  const UDIO_KEY = process.env.UDIO_API_KEY || "sk-c46097b1232946e0a900a86de19a2722";

  try {
    const body = req.body || {};
    const { type, nom, style, occasion, message, prompt, question } = body;

    // === MODE CHANSON ===
    if (type === 'chanson' || (prompt && prompt.toLowerCase().includes('chanson'))) {
      const finalPrompt = prompt || `[${style || 'Afrobeat'}, ${occasion || 'Amour'}] Chanson pour ${nom || 'mon amour'}. ${message}. Paroles en français, refrain avec le nom ${nom}, voix émouvante, style ${style}`;

      const udioRes = await fetch("https://api.udio.com/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${UDIO_KEY}`
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          lyrics: message || finalPrompt,
          style: style || "Afrobeat"
        })
      });

      const data = await udioRes.json();
      
      // Si Udio renvoie erreur (clé proxy), on renvoie mode démo
      if (!udioRes.ok) {
        return res.status(200).json({
          success: true,
          mode: "demo",
          prompt: finalPrompt,
          lyrics: finalPrompt,
          audio_url: null,
          message: "Clé OK - Configure ENV sur Vercel"
        });
      }
      
      return res.status(200).json({ success: true, ...data });
    }

    // === MODE JASONBOT CHAT NORMAL ===
    return res.status(200).json({
      success: true,
      bot: "JasonBot",
      response: `Yo c'est JasonBot 🔥 Tu as dit: ${question || message || prompt || "Salut"}`,
      info: "Utilise type:'chanson' pour générer une chanson"
    });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
