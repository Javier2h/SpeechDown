from flask import Flask
from routes.usuarios import usuarios_bp
from routes.actividades import actividades_bp
from routes.ninos import ninos_bp
from flask_cors import CORS

from config.db_config import engine
from models.db_model import Base

# Esto crea las tablas si no existen
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)

app.register_blueprint(usuarios_bp)
app.register_blueprint(actividades_bp)
app.register_blueprint(ninos_bp)

if __name__ == "__main__":
    app.run(debug=True)