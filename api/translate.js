export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { texts, target } = req.body;

  if (!Array.isArray(texts) || !target) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, target })
      }
    );

    const data = await response.json();

    if (!data?.data?.translations) {
      throw new Error('Invalid response from translation API');
    }

    const translations = data.data.translations.map(t => t.translatedText);
    res.status(200).json({ translations }); // <-- This is important
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
}
