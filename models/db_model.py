from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()

class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    rol = Column(String)  # padre, terapeuta

class Niño(Base):
    __tablename__ = 'ninos'
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    edad = Column(Integer)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    usuario = relationship("Usuario")

class Actividad(Base):
    __tablename__ = 'actividades'
    id = Column(Integer, primary_key=True)
    descripcion = Column(String, nullable=False)
    resultado = Column(String)
    nino_id = Column(Integer, ForeignKey('ninos.id'))
    nino = relationship("Niño")
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    usuario = relationship("Usuario")

class Progreso(Base):
    __tablename__ = 'progresos'
    id = Column(Integer, primary_key=True)
    avance = Column(String)
    actividad_id = Column(Integer, ForeignKey('actividades.id'))
    actividad = relationship("Actividad")
    fecha = Column(String)