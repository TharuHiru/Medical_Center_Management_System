const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

router.get('/fetch-assistants', assistantController.fetchAllAssistants);
router.put('/assistants/:id' , assistantController.updateAssistant);
router.put('/deactivate-assistant/:id', assistantController.deactivateAssistant);
module.exports = router;
