const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

//!! Endpoint for getting msg by ID
router.get('/:id',
    messageController.getMessageById);
    
//!
router.get('/conversation/:id/',
    messageController.getMessagesByConversationId);

//!! Endpoint for adding a new msg
router.post('/user/:userId/conversation/:conversationId',
    messageController.addMessage);

//!! Endpoint for deleting a msg
router.delete('/:id',
    messageController.deleteMessage);

module.exports = router;
