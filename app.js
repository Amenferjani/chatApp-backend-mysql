const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());


const userRoutes = require('./routes/users');
const imageRoutes = require('./routes/images');
const messageRoutes = require('./routes/messages');
const conversationRoutes = require('./routes/conversations');
const conversationMEmbersRoutes = require('./routes/conversation_members')


app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/conversations-members', conversationMEmbersRoutes);

//!! Start the server
  const PORT = process.env.PORT || 8800;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
  });

module.exports = app;
