// const express = require('express');
// const { uploadFile, getFiles, upload, getFileViews, getFilesStatistics, getFileStatisticsById, getAllFilesStatistics } = require('../controllers/fileController');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
// router.get('/', authMiddleware, getFiles);


// router.get('/file/:id/view', authMiddleware, getFileViews);
// router.get('/file/:id/statistics', authMiddleware, getFileStatisticsById);
// router.get('/files/statistics', authMiddleware, getAllFilesStatistics);
  
  

// module.exports = router;



const express = require('express');
const {
  uploadFile,
  getFiles,
  upload,
  getFileViews,
  getFileStatisticsById,
  getAllFilesStatistics
} = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// File upload route
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

// Fetch all files
router.get('/', authMiddleware, getFiles);

// File view and statistics routes
router.get('/file/:id/view', authMiddleware, getFileViews);
router.get('/file/:id/statistics', authMiddleware, getFileStatisticsById);
router.get('/statistics', authMiddleware, getAllFilesStatistics);

module.exports = router;


