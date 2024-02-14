   const express = require('express');
   const router = express.Router();
   const conversationMembersController = require('../controllers/conversationMembersController');


   router.get('/:id',
      conversationMembersController.getMembersOfConversation
   );

   router.get('/user-conversations/:id',
      conversationMembersController.getConversationForUser
   );

   router.post('/:id/addMember/:userId',
      conversationMembersController.addMemberToConversation
   );

   router.delete('/:id/removeMember/:userId',
      conversationMembersController.removeMemberFromConversation
   );

   module.exports = router;
