# routes/actividades.py
from flask import Blueprint, request, jsonify, send_file
from services.openai_service import generar_ejercicio
from models.db_model import Actividad, Progreso
from config.db_config import SessionLocal
from services.tts_service import texto_a_voz

actividades_bp = Blueprint('actividades', __name__)

@actividades_bp.route('/api/ia/generar-ejercicio', methods=['POST'])
def generar():
    data = request.json
    ejercicio = generar_ejercicio(data)
    if ejercicio.get('success'):
        return jsonify(ejercicio), 200
    else:
        return jsonify(ejercicio), 500

@actividades_bp.route('/api/actividades', methods=['POST'])
def crear_actividad():
    data = request.json
    session = SessionLocal()
    actividad = Actividad(
        descripcion=data['descripcion'],
        resultado=data.get('resultado', ''),
        nino_id=data['nino_id'],
        usuario_id=data['usuario_id']
    )
    session.add(actividad)
    session.commit()
    result = {
        'id': actividad.id,
        'descripcion': actividad.descripcion,
        'resultado': actividad.resultado,
        'nino_id': actividad.nino_id,
        'usuario_id': actividad.usuario_id
    }
    session.close()
    return jsonify(result), 201

@actividades_bp.route('/api/actividades', methods=['GET'])
def listar_actividades():
    session = SessionLocal()
    actividades = session.query(Actividad).all()
    result = [
        {
            'id': a.id,
            'descripcion': a.descripcion,
            'resultado': a.resultado,
            'nino_id': a.nino_id,
            'usuario_id': a.usuario_id
        }
        for a in actividades
    ]
    session.close()
    return jsonify(result)

@actividades_bp.route('/api/progresos', methods=['POST'])
def crear_progreso():
    data = request.json
    session = SessionLocal()
    progreso = Progreso(
        avance=data['avance'],
        actividad_id=data['actividad_id'],
        fecha=data['fecha']
    )
    session.add(progreso)
    session.commit()
    result = {
        'id': progreso.id,
        'avance': progreso.avance,
        'actividad_id': progreso.actividad_id,
        'fecha': progreso.fecha
    }
    session.close()
    return jsonify(result), 201

@actividades_bp.route('/api/progresos', methods=['GET'])
def listar_progresos():
    session = SessionLocal()
    progresos = session.query(Progreso).all()
    result = [
        {
            'id': p.id,
            'avance': p.avance,
            'actividad_id': p.actividad_id,
            'fecha': p.fecha
        }
        for p in progresos
    ]
    session.close()
    return jsonify(result)

@actividades_bp.route('/api/tts', methods=['POST'])
def generar_audio():
    data = request.json
    texto = data.get('texto', '')
    if not texto:
        return {'error': 'Texto requerido'}, 400
    path_audio = texto_a_voz(texto)
    return send_file(path_audio, mimetype='audio/mpeg', as_attachment=True, download_name='audio.mp3')