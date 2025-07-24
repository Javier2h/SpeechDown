const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');

// Configurar Google Cloud TTS (opcional)
let ttsClient = null;
try {
    const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
    ttsClient = new TextToSpeechClient({
        keyFilename: process.env.GOOGLE_CLOUD_CREDENTIALS
    });
    console.log('✅ Google Cloud TTS configurado correctamente');
} catch (error) {
    console.log('⚠️ Google Cloud TTS no configurado - el audio no funcionará');
}

// Importar modelos
require('./models/child');
require('./models/session');

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const childRoutes = require('./routes/childRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Usar rutas
app.use('/api/children', childRoutes);
app.use('/api/sessions', sessionRoutes);

// Ruta para generar ejercicios
app.post('/api/ejercicio', async (req, res) => {
    try {
        const { palabra } = req.body;
        
        const ejercicio = `Ejercicio para practicar la palabra "${palabra}": Repite la palabra 5 veces lentamente, luego úsala en una oración.`;
        res.json({ ejercicio });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar ejercicio' });
    }
});

// Ruta para text-to-speech
app.post('/api/tts', async (req, res) => {
    try {
        const { texto } = req.body;
        
        if (!ttsClient) {
            return res.status(503).json({ 
                error: 'Text-to-Speech no configurado. Habilita la API de Google Cloud Text-to-Speech.' 
            });
        }
        
        // Configurar la solicitud de TTS
        const request = {
            input: { text: texto },
            voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Generar audio
        const [response] = await ttsClient.synthesizeSpeech(request);
        
        // Enviar el audio
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(response.audioContent);
    } catch (error) {
        console.error('Error en TTS:', error);
        res.status(500).json({ 
            error: 'Error en text-to-speech. Verifica que la API esté habilitada en Google Cloud.' 
        });
    }
});

// Conectar y sincronizar con la base de datos
sequelize.sync({ alter: true })  //  Usa { force: true } solo para pruebas que reinicien tablas
  .then(() => {
    console.log(' Base de datos sincronizada correctamente');
    // Iniciar servidor
    app.listen(3000, () => {
      console.log(' Servidor escuchando en http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error(' Error al sincronizar la base de datos:', err);
  });
