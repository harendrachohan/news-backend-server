const Groq = require('groq-sdk');
const config = require('../config');

let groqClient = null;

function getClient() {
  if (!config.groqApiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey: config.groqApiKey });
  }
  return groqClient;
}

async function summarize(content) {
  const client = getClient();
  if (!client) {
    return truncate(content, 200);
  }

  const text = content.slice(0, 2000);
  if (!text.trim()) return '';

  try {
    const res = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'user',
        content: `Summarize this news article in 2-3 sentences:\n\n${text}`,
      }],
      max_tokens: 150,
    });
    console.error(text);
    console.error('Groq summarization failed:', res.choices[0]?.message?.content?.trim());
    return res.choices[0]?.message?.content?.trim() || truncate(content, 200);
  } catch (err) {
    console.error('Groq summarization failed:', err.message);
    return truncate(content, 200);
  }
}

function truncate(text, maxLen) {
  if (!text) return '';
  return text.length <= maxLen ? text : `${text.slice(0, maxLen).trim()}…`;
}

module.exports = { summarize };
