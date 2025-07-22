# services/openai_service.py
import requests
import os

def generar_ejercicio(data):
    prompt = f"Genera una historia de 5 oraciones con sílabas directas para un niño de {data['edad']} años sobre '{data['tema']}'."
    api_key ='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'
    if not api_key:
        return {'success': False, 'error': 'No se encontró la clave OPENAI_API_KEY en las variables de entorno.'}
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'gpt-4',
        'messages': [
            {'role': 'system', 'content': 'Eres un generador de ejercicios de habla para niños.'},
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': 200
    }
    try:
        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            return {'success': True, 'result': content}
        else:
            return {'success': False, 'error': response.text}
    except Exception as e:
        return {'success': False, 'error': str(e)}