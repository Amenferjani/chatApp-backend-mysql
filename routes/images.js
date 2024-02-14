const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

//!! Endpoint for getting image by ID
router.get('/:id',
    imageController.getImageById);

//!! Endpoint for adding a new image
router.post('/',
    imageController.addImage);

//!! Endpoint for updating image information
router.put('/:id',
    imageController.updateImage);

//!! Endpoint for deleting a image
router.delete('/:id',
    imageController.deleteImage);

module.exports = router;
