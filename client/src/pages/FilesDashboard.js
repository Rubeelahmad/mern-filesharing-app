import {
  useEffect,
  useState,
} from 'react';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import FilesGridArea from '../components/FilesGridArea';
import {
  getFiles,
  uploadFile,
} from '../services/api';

const FilesDashboard = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await getFiles();
      setFiles(data);
    };
    fetchFiles();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFile(formData);
      const { data } = await getFiles();
      setFiles(data);
      setFile(null); 
      setFilePreview(null); 
      e.target.reset(); 
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error.message);
      toast.error('Failed to upload file. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    previewFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    previewFile(droppedFile);
  };

  const previewFile = (file) => {
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file));
      } else if (fileType === "application/pdf") {
        setFilePreview(URL.createObjectURL(file));
      } else if (fileType === "video/mp4") {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Files Dashboard</h1>

      <form onSubmit={handleFileUpload} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Upload a File</h2>

        <div
          className={`mb-4 p-4 border-2 border-dashed rounded-md w-full text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <p className="text-blue-600 font-semibold">{file.name}</p>
          ) : (
            <p className="text-gray-500">Drag and drop a file here, or select a file below</p>
          )}
        </div>

        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
        >
          Upload
        </button>
      </form>

      {/* File Preview */}
      {filePreview && (
        <div className="mb-8 p-4 border rounded-lg shadow-md w-full max-w-lg bg-white">
          <h3 className="text-lg font-semibold mb-2">File Preview</h3>
          {file.type.startsWith("image/") && <img src={filePreview} alt="preview" className="w-full h-auto mb-4" />}
          {file.type === "application/pdf" && (
            <iframe src={filePreview} title="PDF Preview" className="w-full h-96 mb-4"></iframe>
          )}
          {file.type === "video/mp4" && (
            <video controls src={filePreview} className="w-full h-auto mb-4" />
          )}
          {(file.type === "audio/mp3" || file.type === "audio/mpeg") && (
            <audio controls src={filePreview} className="w-full h-auto mb-4" />
          )}
        </div>
      )}

      <div className="w-full max-w-4xl">
        {files.length > 0 ? (
          <FilesGridArea files={files} />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            No files uploaded
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesDashboard;



