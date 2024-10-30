import React, {
  useEffect,
  useState,
} from 'react';

import * as pdfjsLib from 'pdfjs-dist/webpack';
import {
  FaFilePdf,
  FaFileVideo,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Helper function to generate a video thumbnail at 2 seconds
const generateVideoThumbnail = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.currentTime = 2; // Set to 2 seconds for preview frame

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    });

    video.addEventListener("error", (error) => reject(error));
  });
};

// Helper function to generate a PDF thumbnail
const generatePdfThumbnail = async (pdfUrl) => {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.5 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
};

// Sortable item component for each file
const SortableFileItem = ({
  file,
  handleFileClick,
  handleCopyLink,
  handleViewStatistics,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // Convert file size to MB if over 1 MB, otherwise show in KB
  const fileSize =
    file.filesize > 1024 * 1024
      ? `${(file.filesize / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.filesize / 1024).toFixed(2)} KB`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
        ) : file.thumbnailUrl ? (
          <img
            src={file.thumbnailUrl}
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
      <p className="text-sm text-gray-500">Size: {fileSize}</p>
      <p className="text-sm text-gray-500">Views: {file.views}</p>
      <button
       onClick={() => handleCopyLink(file.fileUrl)}
       //onClick={() => handleCopyLink(file._id, file.filename)}
        className="text-blue-500 hover:text-blue-700 underline mt-2"
      >
        Copy Link
      </button>
      <button
        onClick={() => handleViewStatistics(file._id)}
        className="bg-green-600 text-white py-1 px-4 rounded-md font-semibold hover:bg-green-700 transition duration-300 mt-2"
      >
        View Statistics
      </button>
    </div>
  );
};

const FilesGridArea = ({ files: initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles);
  const navigate = useNavigate();

  useEffect(() => {
    const generateThumbnails = async () => {
      const updatedFiles = await Promise.all(
        initialFiles.map(async (file) => {
          if (file.filetype.startsWith("video") && !file.thumbnailUrl) {
            file.thumbnailUrl = await generateVideoThumbnail(file.fileUrl);
          } else if (
            file.filetype === "application/pdf" &&
            !file.thumbnailUrl
          ) {
            file.thumbnailUrl = await generatePdfThumbnail(file.fileUrl);
          }
          return file;
        })
      );
      setFiles(updatedFiles);
    };

    generateThumbnails();
  }, [initialFiles]);



  const handleCopyLink = (url) => {
        //http://localhost:5000/uploads/${file.filename}?view=true
    const updatedUrl = `${url}?view=true`
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(updatedUrl)
        .then(() => toast.info("Link copied successfully!"))
        .catch((error) => {
          console.error("Clipboard API error:", error);
          fallbackCopyToClipboard(updatedUrl);
        });
    } else {
      fallbackCopyToClipboard(updatedUrl);
    }
  };

  // const handleCopyLink = (fileId, fileName) => {
  //   const redirectLink = `http://localhost:3000/shareable/${fileId}.${fileName}`; 
  //   if (navigator.clipboard) {
  //     navigator.clipboard
  //       .writeText(redirectLink)
  //       .then(() => toast.info("Link copied successfully!"))
  //       .catch((error) => {
  //         console.error("Clipboard API error:", error);
  //         fallbackCopyToClipboard(redirectLink);
  //       });
  //   } else {
  //     fallbackCopyToClipboard(redirectLink);
  //   }
  // };
  
  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.info("Link copied successfully!");
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
      toast.error("Could not copy the link. Please try again.");
    }
    document.body.removeChild(textArea);
  };

  const handleViewStatistics = (fileId) => {
    navigate(`/statistics/${fileId}`);
  };

  const handleFileClick = async (fileId, fileUrl) => {
    try {
    //  await incrementFileView(fileId);
    //http://localhost:5000/uploads/${file.filename}?view=true
    const updatedUrl = `${fileUrl}?view=true`
      window.open(updatedUrl, "_blank", "noopener,noreferrer");

      // Optional: Update the file’s view count in the UI without reloading
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f._id === fileId ? { ...f, views: f.views + 1 } : f
        )
      );
    } catch (error) {
      console.error("Failed to increment view count:", error);
      toast.error("Could not update view count");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={files.map((file) => file._id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {files.map((file) => (
            <SortableFileItem
              key={file._id}
              file={file}
              handleFileClick={handleFileClick}
              handleCopyLink={handleCopyLink}
              handleViewStatistics={handleViewStatistics}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default FilesGridArea;
