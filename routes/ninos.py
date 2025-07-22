from flask import Blueprint, request, jsonify
from models.db_model import Niño
from config.db_config import SessionLocal

ninos_bp = Blueprint('ninos', __name__)

@ninos_bp.route('/api/ninos', methods=['GET'])
def get_ninos():
    session = SessionLocal()
    ninos = session.query(Niño).all()
    result = [
        {'id': n.id, 'nombre': n.nombre, 'edad': n.edad, 'usuario_id': n.usuario_id}
        for n in ninos
    ]
    session.close()
    return jsonify(result)

@ninos_bp.route('/api/ninos/<int:id>', methods=['GET'])
def get_nino(id):
    session = SessionLocal()
    nino = session.query(Niño).get(id)
    if nino:
        result = {'id': nino.id, 'nombre': nino.nombre, 'edad': nino.edad, 'usuario_id': nino.usuario_id}
        session.close()
        return jsonify(result)
    session.close()
    return jsonify({'error': 'Niño no encontrado'}), 404

@ninos_bp.route('/api/ninos', methods=['POST'])
def create_nino():
    data = request.json
    session = SessionLocal()
    nino = Niño(nombre=data['nombre'], edad=data['edad'], usuario_id=data['usuario_id'])
    session.add(nino)
    session.commit()
    result = {'id': nino.id, 'nombre': nino.nombre, 'edad': nino.edad, 'usuario_id': nino.usuario_id}
    session.close()
    return jsonify(result), 201

@ninos_bp.route('/api/ninos/<int:id>', methods=['PUT'])
def update_nino(id):
    data = request.json
    session = SessionLocal()
    nino = session.query(Niño).get(id)
    if not nino:
        session.close()
        return jsonify({'error': 'Niño no encontrado'}), 404
    nino.nombre = data.get('nombre', nino.nombre)
    nino.edad = data.get('edad', nino.edad)
    nino.usuario_id = data.get('usuario_id', nino.usuario_id)
    session.commit()
    result = {'id': nino.id, 'nombre': nino.nombre, 'edad': nino.edad, 'usuario_id': nino.usuario_id}
    session.close()
    return jsonify(result)

@ninos_bp.route('/api/ninos/<int:id>', methods=['DELETE'])
def delete_nino(id):
    session = SessionLocal()
    nino = session.query(Niño).get(id)
    if not nino:
        session.close()
        return jsonify({'error': 'Niño no encontrado'}), 404
    session.delete(nino)
    session.commit()
    session.close()
    return jsonify({'message': 'Niño eliminado'}) 