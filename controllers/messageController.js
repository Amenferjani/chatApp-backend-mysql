const mysql = require('mysql2');
const { io } = require('../server');
const connection = require('../config/database'); // Import the MySQL connection

// todo
async function addMessage(req, res) {
    try {
        const { content } = req.body;
        const userId = req.params.userId;
        const conversationId = req.params.conversationId;
        const date = new Date();

        const insertQuery = `
            INSERT INTO messages (content, sent_at, user_id, conversation_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await connection.promise().query(insertQuery, [content, date, userId, conversationId]);

        const message = {
            id: result.insertId,
            content: content,
            sent_at: date,
            user_id: userId,
            conversation_id: conversationId
        };

        io.emit("message", message);
        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
async function getMessagesByConversationId(req,res) {
    try {
        
        const conversationId = req.params.id;
        const queryString = 'SELECT * FROM messages WHERE conversation_id=? ORDER BY sent_at';
        const [messages] = await connection.promise().query(queryString,[conversationId]);
        if(!messages.length){
            return res.status(404).send({message:"No Messages Found!"});
        }
        res.json(messages)
    } catch (error) {
        res.status(500).json({message:"server error"});
    }

}
// todo
async function getMessageById(req, res) {
    try {
        
        const messageId = req.params.id;
        const query = `SELECT * FROM messages WHERE id = ?`;
        const [message] = await connection.promise().query(query, [messageId]);

        if (!message.length) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function deleteMessage(req, res) {
    try {
        const messageId = req.params.id;
        const query = `DELETE FROM messages WHERE id = ?`;
        const [result] = await connection.promise().query(query, [messageId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getMessageById,
    addMessage,
    deleteMessage,
    getMessagesByConversationId,
};
