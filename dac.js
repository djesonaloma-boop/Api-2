export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    name: "JasonBot API",
    version: "2.0 - Udio Inside",
    endpoints: {
      "POST /Api/ai.js": {
        chat: { question: "Salut Jason" },
        chanson: { type: "chanson", nom: "Sarah", style: "Rumba", occasion: "Amour", message: "Je t'aime" }
      }
    },
    udio_connected: true
  });
}