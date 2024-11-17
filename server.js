const express = require('express');
const fileUpload = require('express-fileupload');
const fileRoutes = require('./routes/files');
const { sequelize } = require('./models/fileModel');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/api/files', fileRoutes);

// Database Sync
sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(3001, () => console.log('Server running on port 3001'));
}).catch(err => console.error('Database connection error:', err));
