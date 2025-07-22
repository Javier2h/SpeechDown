from google.cloud import texttospeech
import tempfile

# Esta función convierte texto a voz y devuelve el path temporal del archivo de audio generado

def texto_a_voz(texto, idioma='es-ES', voz='es-ES-Standard-A'):
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=texto)
    voice = texttospeech.VoiceSelectionParams(
        language_code=idioma,
        name=voz
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    # Guardar el audio en un archivo temporal
    temp = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
    temp.write(response.audio_content)
    temp.close()
    return temp.name 