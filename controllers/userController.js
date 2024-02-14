const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const connection = require('../config/database'); 

// todo
async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const query = `SELECT * FROM users WHERE id = ?`;
        const [user] = await connection.promise().query(query, [userId]);
        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
async function getUserByEmailAndPassword(req, res) {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email =?";
    connection.query(sql, [email], async (error, results) => {
        if (error) {
            console.error("Error executing SQL query:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "User not found", code: "USER_NOT_FOUND" });
        }

        const hashedPasswordFromDB = results[0].password;

        try {
            const isMatch = await bcrypt.compare(password, hashedPasswordFromDB);

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid password", code: "INVALID_PASSWORD" });
            }

            res.status(200).json({msg : "login successfully",id:results[0].id});
        } catch (bcryptErr) {
            console.error("Error comparing passwords:", bcryptErr);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}

    // try {
    //     const email = req.body.email ;
        
    //     const query = `SELECT * FROM users WHERE email =?`;
    //     const user = await connection.promise().query(query, [email]);
    //     if (user.length === 0) {
    //         return res.status(401).json({ message: 'User not found' ,test:"test1" });
    //     }
    //     // const hashedPasswordFromDB = user[0].password;
    //     // const passwordMatches = await bcrypt.compare(password, hashedPasswordFromDB);
    //     // if (!passwordMatches) {
    //     //     return res.status(401).json({ message: 'Invalid password' ,test:"test2"});
    //     // }
    //     res.json(user[0],{test:"test3"});
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: 'Server error' });
    // }




// todo
async function createUser(req, res) {
    try {
        // !! Extract user data from the request body
        const { username, email, password } = req.body;

        const existingUserQuery = `SELECT * FROM users WHERE email = ?`;
        const [existingUser] = await connection.promise().query(existingUserQuery, [email]);

        if (existingUser.length > 0) {
            // !! If a user with the same email already exists, return an error response
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // !! Use a query to insert a new user into the database
        const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        await connection.promise().query(insertQuery, [username, email, hashedPassword]);

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function updateUserPassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const isPasswordMatch = await bcrypt.compare(oldPassword, req.session.passport.passwordHash);

        if (isPasswordMatch) {
            // !! If the old password matches, hash the new password
            const newPasswordHash = bcrypt.hashSync(newPassword, 10);
            // !! Update the user's password using a query
            const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;
            await connection.promise().query(updateQuery, [newPasswordHash, req.params.id]);

            res.json({ message: 'Password updated successfully' });
        } else {
            // !! If the old password doesn't match, send an error response
            res.status(401).json({ message: 'Invalid old password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// todo
async function updateUserImage(req, res) {
    try {
        const userId = req.params.userId;
        const imageId = req.params.imageId;

        // !! Update the user's image_id using a query
        const updateQuery = `UPDATE users SET image_id = ? WHERE id = ?`;
        await connection.promise().query(updateQuery, [imageId, userId]);

        const getUserQuery = `SELECT * FROM users WHERE id = ?`;
        const [updatedUser] = await connection.promise().query(getUserQuery, [userId]);

        res.json(updatedUser[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getUserById,
    createUser,
    updateUserPassword,
    updateUserImage,
    getUserByEmailAndPassword
};