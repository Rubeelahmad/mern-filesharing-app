
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filetype: { type: String, required: true },
  filesize: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 }, // Initialize view count
  createdAt: { type: Date, default: Date.now }, // Creation date
});

module.exports = mongoose.model('File', fileSchema);
