const { io } = require('../server');
const connection = require('../config/database'); // Import the MySQL connection

async function getMembersOfConversation(req, res) {
    try {
        const conversationId = req.params.id;
        const query = `SELECT * FROM conversation_members WHERE conversation_id = ?`;
        const [members] = await connection.promise().query(query, [conversationId]);

        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
async function getConversationForUser(req, res) {
    try {
        const userId = req.params.id;
        const query = `
            SELECT conversations.*
            FROM conversation_members
            JOIN conversations ON conversation_members.conversation_id = conversations.id
            WHERE conversation_members.user_id = ?
        `;
        const [conversations] = await connection.promise().query(query, [userId]);
        
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function addMemberToConversation(req, res) {
    try {
        const conversationId = req.params.id;
        const userId = req.params.userId;

        const insertQuery = `
            INSERT INTO conversation_members (conversation_id, user_id)
            VALUES (?, ?)
        `;
        const [result] = await connection.promise().query(insertQuery, [conversationId, userId]);

        const conversationMember = {
            id: result.insertId,
            conversation_id: conversationId,
            user_id: userId,
        };

        res.json(conversationMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function removeMemberFromConversation(req, res) {
    try {
        const conversationId = req.params.id;
        const userId = req.params.userId;

        const getMemberQuery = `
            SELECT * FROM conversation_members
            WHERE conversation_id = ? AND user_id = ?
        `;
        const [conversationMember] = await connection.promise().query(getMemberQuery, [conversationId, userId]);

        if (!conversationMember.length) {
            return res.status(404).json({ message: 'Member not found in conversation' });
        }

        const deleteQuery = `
            DELETE FROM conversation_members
            WHERE conversation_id = ? AND user_id = ?
        `;
        await connection.promise().query(deleteQuery, [conversationId, userId]);

        res.json({ message: 'Member removed from conversation successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addMemberToConversation,
    removeMemberFromConversation,
    getMembersOfConversation,
    getConversationForUser
};
