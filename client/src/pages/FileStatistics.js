import {
  useEffect,
  useState,
} from 'react';

import { useParams } from 'react-router-dom';

import { getFileStatistics } from '../services/api';

const FileStatistics = () => {
  const { id } = useParams();
  const [fileStats, setFileStats] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await getFileStatistics(id);
        setFileStats(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error.message);
      }
    };

    fetchStatistics();
  }, [id]);

  if (!fileStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">File Statistics</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">{fileStats.filename}</h2>
        <p><strong>Views:</strong> {fileStats.views}</p>
        <p><strong>Uploaded By:</strong> {fileStats.uploadedBy}</p>
        <p><strong>Upload Date:</strong> {new Date(fileStats.createdAt).toLocaleDateString()}</p>
        <p><strong>File Type:</strong> {fileStats.mimetype}</p>
      </div>
    </div>
  );
};

export default FileStatistics;
