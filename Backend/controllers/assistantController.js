const AssistantModel = require('../models/assistantModel');

//Get All Assistants
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

module.exports = {
    fetchAllAssistants,
};
