const Session = require('../models/session');

exports.createSession = async (req, res) => {
    try {
        const { palabra, ejercicio, childId } = req.body;
        const session = await Session.create({ palabra, ejercicio, ChildId: childId });
        res.status(201).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSessionsByChild = async (req, res) => {
    try {
        const { id } = req.params;
        const sesiones = await Session.findAll({ where: { ChildId: id } });
        res.status(200).json(sesiones);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
