const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');

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
