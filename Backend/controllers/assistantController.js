const AssistantModel = require('../models/assistantModel');

// Get all assistants
const fetchAllAssistants = async (req, res) => {
  try {
    const assistants = await AssistantModel.getAllAssistants();
    console.log('Fetched Assistants:', assistants);
    res.status(200).json({ success: true, data: assistants });
  } catch (error) {
    console.error('Error fetching Assistants:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Update assistant
const updateAssistant = async (req, res) => {
  const assistantId = req.params.id;
  const updatedData = req.body;

  try {
    const result = await AssistantModel.updateAssistant(assistantId, updatedData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Assistant not found' });
    }

    res.status(200).json({ success: true, message: 'Assistant updated successfully' });
  } catch (error) {
    console.error("Error updating assistant:", error);
    res.status(500).json({ success: false, message: 'Server error while updating assistant' });
  }
};

const deactivateAssistant = async (req, res) => {
  const assistantId = req.params.id;

  try {
    const result = await AssistantModel.deactivateAssistant(assistantId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Assistant not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Assistant deactivated successfully',
      data: {
        affectedRows: result.affectedRows
      }
    });
  } catch (error) {
    console.error("Error deactivating assistant:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deactivating assistant' 
    });
  }
};
module.exports = {
  fetchAllAssistants,
  updateAssistant,
  deactivateAssistant
};
