import React from 'react';

import {
  FaFilePdf,
  FaFileVideo,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { incrementFileView } from '../services/api';

const FilesGridArea = ({ files }) => {
  const navigate = useNavigate();

  // const handleCopyLink = (url) => {
  //   navigator.clipboard.writeText(url);
  //   toast.info("Link Copied successfully!");
  // };

  const handleCopyLink = (url) => {
    console.log("Copying link:", url);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast.info("Link copied successfully!");
      }).catch((error) => {
        console.error('Clipboard API error:', error);
        fallbackCopyToClipboard(url);
      });
    } else {
      fallbackCopyToClipboard(url);
    }
  };
  
  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.info("Link copied successfully!");
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error("Could not copy the link. Please try again.");
    }
    document.body.removeChild(textArea);
  };

  const handleViewStatistics = (fileId) => {
    navigate(`/statistics/${fileId}`);
  };

  // Increment view count and open file
  const handleFileClick = async (fileId, fileUrl) => {
    try {
      await incrementFileView(fileId);
      window.open(fileUrl, '_blank', 'noopener,noreferrer'); // Open the file in a new tab
    } catch (error) {
      console.error('Failed to increment view count:', error);
      toast.error('Could not update view count');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {files.map((file) => (
        <div
          key={file._id}
          className="bg-white shadow-md p-4 rounded-lg border border-gray-200 flex flex-col items-center"
        >
          <div
            onClick={() => handleFileClick(file._id, file.fileUrl)}
            className="w-full h-40 flex items-center justify-center rounded-md mb-2 cursor-pointer"
          >
            {file.filetype.startsWith("image") ? (
              <img
                src={file.fileUrl}
                alt={file.filename}
                className="w-full h-full object-cover rounded-md"
              />
            ) : file.filetype === "application/pdf" ? (
              <FaFilePdf className="text-red-500 text-6xl" />
            ) : file.filetype.startsWith("video") ? (
              <FaFileVideo className="text-blue-500 text-6xl" />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
                <p className="text-gray-500">No Preview Available</p>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold truncate w-full text-center">
            {file.filename}
          </h3>
          <p className="text-sm text-gray-500">
            Size: {(file.filesize / 1024).toFixed(2)} KB
          </p>

          <button
            onClick={() => handleCopyLink(file.fileUrl)}
            className="text-blue-500 hover:text-blue-700 underline mt-2"
          >
            Copy Link
          </button>

          {/* View Statistics Button */}
          <button
            onClick={() => handleViewStatistics(file._id)}
            className="bg-green-600 text-white py-1 px-4 rounded-md font-semibold hover:bg-green-700 transition duration-300 mt-2"
          >
            View Statistics
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilesGridArea;


