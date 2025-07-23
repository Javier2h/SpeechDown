const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');

// GET todos los niños
router.get('/', async (req, res) => {
  try {
    await childController.getChildren(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los niños' });
  }
});

// GET un niño por ID
router.get('/:id', async (req, res) => {
  try {
    await childController.getChildById(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el niño' });
  }
});

// POST: Crear nuevo niño
router.post('/', async (req, res) => {
  try {
    await childController.createChild(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el niño' });
  }
});

// PUT: Actualizar por ID
router.put('/:id', async (req, res) => {
  try {
    await childController.updateChild(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el niño' });
  }
});

// DELETE: Eliminar por ID
router.delete('/:id', async (req, res) => {
  try {
    await childController.deleteChild(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el niño' });
  }
});

module.exports = router;
