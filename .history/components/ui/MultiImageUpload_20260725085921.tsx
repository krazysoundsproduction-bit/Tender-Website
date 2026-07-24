"use client";

import { useState } from "react";
import Image from "next/image";

interface MultiImageUploadProps {
  onImagesSelect: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  url?: string;
  error?: string;
}

export default function MultiImageUpload({
  onImagesSelect,
  maxImages = 6,
  label = "Upload Photos",
  helperText = "Optional: Upload up to 6 photos",
}: MultiImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setError("");

    // Check file count
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      if (file.size > 5242880) {
        // 5MB
        setError("Image size must be less than 5MB");
        return;
      }
    }

    // Create preview and upload
    const newImages: UploadedImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Upload each image
    for (let i = images.length; i < images.length + files.length; i++) {
      uploadImage(i);
    }
  }

  async function uploadImage(index: number) {
    const uploadedImage = images[index];
    if (!uploadedImage) return;

    try {
      const formData = new FormData();
      formData.append("file", uploadedImage.file);

      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await response.json();

      setImages((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          uploading: false,
          url,
        };
        return updated;
      });

      // Notify parent of updated URLs
      const updatedImages = [...images];
      updatedImages[index].url = url;
      const urls = updatedImages
        .filter((img) => img.url)
        .map((img) => img.url as string);
      onImagesSelect(urls);
    } catch (err) {
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          uploading: false,
          error: err instanceof Error ? err.message : "Upload failed",
        };
        return updated;
      });
    }
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const urls = updated
        .filter((img) => img.url)
        .map((img) => img.url as string);
      onImagesSelect(urls);
      return updated;
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {helperText && (
          <p className="text-xs text-gray-500 mb-2">{helperText}</p>
        )}
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <svg
            className="w-8 h-8 text-blue-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PNG, JPG, WebP up to 5MB ({images.length}/{maxImages})
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={images.length >= maxImages}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden">
              <div className="relative w-full h-32">
                <Image
                  src={image.preview}
                  alt={`Upload preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-xs font-medium">
                    Uploading...
                  </div>
                </div>
              )}

              {image.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-xs text-center px-1">
                    {image.error}
                  </div>
                </div>
              )}

              {!image.uploading && !image.error && image.url && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <button
                onClick={() => removeImage(index)}
                disabled={image.uploading}
                className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full p-1 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
