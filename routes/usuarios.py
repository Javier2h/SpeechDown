from flask import Blueprint, request, jsonify
from models.db_model import Usuario
from config.db_config import SessionLocal

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    session = SessionLocal()
    usuarios = session.query(Usuario).all()
    result = [
        {'id': u.id, 'nombre': u.nombre, 'rol': u.rol}
        for u in usuarios
    ]
    session.close()
    return jsonify(result)

@usuarios_bp.route('/api/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    session = SessionLocal()
    usuario = session.query(Usuario).get(id)
    if usuario:
        result = {'id': usuario.id, 'nombre': usuario.nombre, 'rol': usuario.rol}
        session.close()
        return jsonify(result)
    session.close()
    return jsonify({'error': 'Usuario no encontrado'}), 404

@usuarios_bp.route('/api/usuarios', methods=['POST'])
def create_usuario():
    data = request.json
    session = SessionLocal()
    usuario = Usuario(nombre=data['nombre'], rol=data.get('rol', ''))
    session.add(usuario)
    session.commit()
    result = {'id': usuario.id, 'nombre': usuario.nombre, 'rol': usuario.rol}
    session.close()
    return jsonify(result), 201

@usuarios_bp.route('/api/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    data = request.json
    session = SessionLocal()
    usuario = session.query(Usuario).get(id)
    if not usuario:
        session.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404
    usuario.nombre = data.get('nombre', usuario.nombre)
    usuario.rol = data.get('rol', usuario.rol)
    session.commit()
    result = {'id': usuario.id, 'nombre': usuario.nombre, 'rol': usuario.rol}
    session.close()
    return jsonify(result)

@usuarios_bp.route('/api/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    session = SessionLocal()
    usuario = session.query(Usuario).get(id)
    if not usuario:
        session.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404
    session.delete(usuario)
    session.commit()
    session.close()
    return jsonify({'message': 'Usuario eliminado'})
