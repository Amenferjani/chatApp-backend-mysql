const { io } = require('../server');
const connection = require('../config/database'); // Import the MySQL connection

// todo
async function getConversationById(req, res) {
    try {
        const conversationId = req.params.id;
        const query = `SELECT * FROM conversations WHERE id = ?`;
        const [conversation] = await connection.promise().query(query, [conversationId]);

        if (!conversation.length) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function createConversation(req, res) {
    try {
        const { name } = req.body;

        const conversationName = name !== '' ? name : null;

        const insertQuery = `
            INSERT INTO conversations (name, is_group)
            VALUES (?, ?)
        `;
        const [result] = await connection.promise().query(insertQuery, [conversationName, conversationName ? 1 : 0]);

        const newConversation = {
            id: result.insertId,
            name: conversationName,
            is_group: conversationName ? 1 : 0,
        };

        res.json(newConversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function updateConversationName(req, res) {
    try {
        const { name } = req.body;
        const conversationId = req.params.id;

        const getConversationQuery = `SELECT * FROM conversations WHERE id = ?`;
        const [conversation] = await connection.promise().query(getConversationQuery, [conversationId]);

        if (!conversation.length) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const updateQuery = `UPDATE conversations SET name = ? WHERE id = ?`;
        await connection.promise().query(updateQuery, [name, conversationId]);

        res.json({ message: 'Conversation name updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function updateConversationImage(req, res) {
    try {
        const conversationId = req.params.conversationId;
        const imageId = req.params.imageId;

        const updateQuery = `UPDATE conversations SET image_id = ? WHERE id = ?`;
        await connection.promise().query(updateQuery, [imageId, conversationId]);

        const getUpdatedConversationQuery = `SELECT * FROM conversations WHERE id = ?`;
        const [updatedConversation] = await connection.promise().query(getUpdatedConversationQuery, [conversationId]);

        res.json(updatedConversation[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function deleteConversation(req, res) {
    try {
        const conversationId = req.params.id;

        const getConversationQuery = `SELECT * FROM conversations WHERE id = ?`;
        const [conversation] = await connection.promise().query(getConversationQuery, [conversationId]);

        if (!conversation.length) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const deleteQuery = `DELETE FROM conversations WHERE id = ?`;
        await connection.promise().query(deleteQuery, [conversationId]);

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getConversationById,
    createConversation,
    updateConversationName,
    updateConversationImage,
    deleteConversation,
};
