const { io } = require('../server');
const connection = require('../config/database'); // Import the MySQL connection

async function getImageById(req, res) {
    try {
        const imageId = req.params.id;
        const query = `SELECT * FROM images WHERE id = ?`;
        const [image] = await connection.promise().query(query, [imageId]);

        if (!image.length) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json(image[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function addImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageFile = req.file;

        const insertQuery = `INSERT INTO images (image_data) VALUES (?)`;
        const [result] = await connection.promise().query(insertQuery, [imageFile.buffer]);

        const image = {
            id: result.insertId,
            image_data: imageFile.buffer,
        };
        res.json(image);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


async function updateImage(req, res) {
    try {
        if (!req.body.image) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const imageId = req.params.id;
        const imageFile = req.body.image;

        const getImageQuery = `SELECT * FROM images WHERE id = ?`;
        const [image] = await connection.promise().query(getImageQuery, [imageId]);

        if (!image.length) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const updateQuery = `UPDATE images SET image_data = ? WHERE id = ?`;
        await connection.promise().query(updateQuery, [imageFile.data, imageId]);

        res.json({ message: 'Image updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteImage(req, res) {
    try {
        const imageId = req.params.id;

        const getImageQuery = `SELECT * FROM images WHERE id = ?`;
        const [image] = await connection.promise().query(getImageQuery, [imageId]);

        if (!image.length) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const deleteQuery = `DELETE FROM images WHERE id = ?`;
        await connection.promise().query(deleteQuery, [imageId]);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getImageById,
    addImage,
    updateImage,
    deleteImage,
};
