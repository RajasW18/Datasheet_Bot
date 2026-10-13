import { useState, useCallback } from "react";
import { uploadFile, uploadText } from "../services/api";

/**
 * useUpload — Manages file upload state and text paste submission.
 */
export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = useCallback(async (file) => {
    setIsUploading(true);
    setUploadError(null);
    setProgress(10);

    try {
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 85));
      }, 300);

      const result = await uploadFile(file);

      clearInterval(progressInterval);
      setProgress(100);
      setUploadResult(result);

      // Reset progress after a moment
      setTimeout(() => setProgress(0), 1000);

      return result;
    } catch (err) {
      setUploadError(err.message);
      setProgress(0);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleTextUpload = useCallback(async (text, title) => {
    setIsUploading(true);
    setUploadError(null);
    setProgress(50);

    try {
      const result = await uploadText(text, title);
      setProgress(100);
      setUploadResult(result);

      setTimeout(() => setProgress(0), 1000);

      return result;
    } catch (err) {
      setUploadError(err.message);
      setProgress(0);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploadResult(null);
    setUploadError(null);
    setProgress(0);
  }, []);

  return {
    isUploading,
    uploadResult,
    uploadError,
    progress,
    handleFileUpload,
    handleTextUpload,
    reset,
  };
}
