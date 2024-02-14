const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

//!! Endpoint for getting conversation by ID
router.get('/:id',
    conversationController.getConversationById);

//!! Endpoint for creating a new conversation
router.post('/',
    conversationController.createConversation);

//!! Endpoint for updating conversation name
router.put('/:id/update-conversation-name',
    conversationController.updateConversationName);

//!! Endpoint for updating conversation image
router.put('/:conversationId/update-conversation-image/:imageId',
    conversationController.updateConversationImage);

//!! Endpoint for deleting a conversation
router.delete('/:id',
    conversationController.deleteConversation);

module.exports = router;
