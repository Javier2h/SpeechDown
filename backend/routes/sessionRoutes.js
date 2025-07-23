const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession);
router.get('/child/:id', sessionController.getSessionsByChild);

module.exports = router;
