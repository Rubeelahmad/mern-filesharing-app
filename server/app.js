const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const File = require('./models/File');

require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: false
}));

app.use(express.json());

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Custom route to conditionally increment views and serve files from 'uploads'
app.get('/uploads/:filename', async (req, res) => {
    const { filename } = req.params;
    const { view } = req.query; 
  
    try {
      // Increment view count only if "view=true" is present in the query
      if (view === 'true') {
        const fileRecord = await File.findOne({ filename });
        if (fileRecord) {
          fileRecord.views += 1;
          await fileRecord.save();
        }
      }
  
      // Serve the file from the 'uploads' directory
      const filePath = path.join(__dirname, 'uploads', filename);
      res.sendFile(filePath);
    } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).json({ error: 'Could not load the file' });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
