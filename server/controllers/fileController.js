const File = require('../models/File');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Set limit to 20MB (adjust as needed)
});

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const newFile = await File.create({
      filename: file.filename,
      filetype: file.mimetype,
      filesize: file.size,
      fileUrl: `${process.env.API_URI}/uploads/${file.filename}`,
      user: req.user._id,
      views: 0,
      createdAt: new Date(),
    });
    res.json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all files for a specific user
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment views when file is accessed directly
// const incrementFileViews = async (req, res, next) => {
//   const { file } = req.params;

//   try {
//     const fileRecord = await File.findOne({ filename: file });
//     if (fileRecord) {
//       fileRecord.views += 1;
//       await fileRecord.save();
//     }
//     next();
//   } catch (error) {
//     console.error('Error incrementing view count:', error);
//     next();
//   }
// };



// Increment view count on file click in the application
const getFileViews = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.views += 1;
    await file.save();

    res.json({ message: 'View counted', views: file.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get file statistics by ID
const getFileStatisticsById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      filename: file.filename,
      views: file.views,
      uploadedBy: file.user,
      createdAt: file.createdAt,
      mimetype: file.filetype,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all files statistics
const getAllFilesStatistics = async (req, res) => {
  try {
    const files = await File.find();
    const statistics = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      views: file.views,
      uploadedBy: file.user,
      createdAt: file.createdAt,
      mimetype: file.filetype,
    }));

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  upload,
  getFileViews,
  getFileStatisticsById,
  getAllFilesStatistics,
  //incrementFileViews,
};
