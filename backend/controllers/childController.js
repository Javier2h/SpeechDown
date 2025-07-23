const { Child } = require('../models');

// GET ALL
exports.getChildren = async (req, res) => {
  try {
    const children = await Child.findAll();
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
};

// GET ONE
exports.getChildById = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findByPk(id);
    if (!child) return res.status(404).json({ error: 'Niño no encontrado' });
    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el niño' });
  }
};

// POST
exports.createChild = async (req, res) => {
  try {
    const { nombre, edad, diagnostico, tutorNombre, tutorEmail } = req.body;

    if (!nombre || !edad || !diagnostico || !tutorNombre) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const newChild = await Child.create({ nombre, edad, diagnostico, tutorNombre, tutorEmail });
    res.status(201).json(newChild);
  } catch (error) {
    console.error('Error al crear niño:', error);
    res.status(400).json({ error: error.message });
  }
};

// PUT
exports.updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, diagnostico, tutorNombre, tutorEmail } = req.body;
    const child = await Child.findByPk(id);
    if (!child) return res.status(404).json({ error: 'Niño no encontrado' });

    await child.update({ nombre, edad, diagnostico, tutorNombre, tutorEmail });
    res.status(200).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findByPk(id);
    if (!child) return res.status(404).json({ error: 'Niño no encontrado' });

    await child.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
