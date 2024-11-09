import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase, STORAGE_BUCKET, initializeStorage } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onUploadComplete: (imageUrl: string) => void;
}

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Ensure storage is initialized
      await initializeStorage();

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <button
        onClick={handleImageClick}
        className={`p-2 hover:bg-gray-700 rounded transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Upload Image"
        type="button"
        disabled={isUploading}
      >
        <Upload size={18} className={`text-gray-300 ${isUploading ? 'animate-pulse' : ''}`} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </>
  );
}