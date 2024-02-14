    const express = require('express');
    const router = express.Router();
    const userController = require('../controllers/userController');

    //!! Endpoint for getting user by ID
    router.get('/:id',
        userController.getUserById);

    //!Endpoint for getting user by email and password
    router.post('/get-user-login-info',
        userController.getUserByEmailAndPassword);
    //!! Endpoint for creating a new user
    router.post('/',
        userController.createUser);

    //!! Endpoint for updating user password
    router.put('/:id/update-password',
        userController.updateUserPassword);

    //!! Endpoint for updating user image
    router.put('/:userId/update-image/:imageId',
        userController.updateUserImage);

    module.exports = router;
