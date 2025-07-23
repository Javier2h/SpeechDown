const { OpenAI } = require('openai');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ttsClient = new TextToSpeechClient();

module.exports = { openai, ttsClient };