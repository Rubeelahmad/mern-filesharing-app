// FileRedirect.js
import React, { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { incrementFileView } from '../services/api';

const FileRedirect = () => {
  const { fileIdAndName } = useParams(); // Expects format fileId.fileName

  useEffect(() => {
    const incrementViewAndRedirect = async () => {
      if (!fileIdAndName) {
        toast.error("Invalid file link.");
        return;
      }

      // Split on the first dot to separate fileId from fileName (with extension)
      const firstDotIndex = fileIdAndName.indexOf(".");
      const fileId = fileIdAndName.substring(0, firstDotIndex);
      const fileName = fileIdAndName.substring(firstDotIndex + 1);

      if (!fileId || !fileName) {
        toast.error("Invalid file link.");
        return;
      }

      try {
        // Call API to increment view count
        await incrementFileView(fileId);

        // Redirect to the actual file URL
        window.location.href = `http://localhost:5000/uploads/${fileName}`;
        
        console.log("File ID:", fileId);
        console.log("File Name:", fileName);
      } catch (error) {
        console.error("Failed to increment view count:", error);
        toast.error("Could not load the file.");
      }
    };

    incrementViewAndRedirect();
  }, [fileIdAndName]);

  return <p>Loading file...</p>; // Optional loading message
};

export default FileRedirect;
