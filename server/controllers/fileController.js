const File = require('../models/File');
const multer = require('multer');
const path = require('path');

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


// const upload = multer({ storage });

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const newFile = await File.create({
      filename: file.filename,
      filetype: file.mimetype,
      filesize: file.size,
      fileUrl: `http://157.230.99.54:5000/uploads/${file.filename}`,   
      user: req.user._id,
      views: 0, // Initialize views count to 0
      createdAt: new Date(), // Set creation date
    });
    res.json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getFileViews = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.views += 1; // Increment view count
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
      mimetype: file.filetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllFilesStatistics = async (req, res) => {
  try {
    const files = await File.find();
    const statistics = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      views: file.views,
      uploadedBy: file.user,
      createdAt: file.createdAt,
      mimetype: file.filetype
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
  getAllFilesStatistics
};
