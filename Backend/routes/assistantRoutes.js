const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

router.get('/fetch-assistants', assistantController.fetchAllAssistants);

module.exports = router;
