import React, {useCallback, useState, useEffect} from 'react';
import {Camera, Upload, X} from 'lucide-react';
import {ThemeProps} from '@/types/dashboard';

interface ImageUploaderProps extends ThemeProps {
    onImageSelect: (file: File) => void;
    onClear: () => void;
    isLoading?: boolean;
    currentFile: File | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         isDark,
                                                         onImageSelect,
                                                         onClear,
                                                         isLoading,
                                                         currentFile
                                                     }) => {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (currentFile) {
            const url = URL.createObjectURL(currentFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }
    }, [currentFile]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    }, [onImageSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    }, [onImageSelect]);

    const clearImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onClear();
    }, [onClear]);

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg ${
                dragActive
                    ? 'border-emerald-500'
                    : isDark
                        ? 'border-slate-700'
                        : 'border-slate-200'
            } transition-colors duration-300`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
            />

            <div className={`p-12 text-center ${
                dragActive
                    ? isDark
                        ? 'bg-slate-800/50'
                        : 'bg-slate-50/50'
                    : ''
            }`}>
                {previewUrl ? (
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt="Upload preview"
                            className="max-h-64 mx-auto rounded-lg"
                        />
                        {!isLoading && (
                            <button
                                onClick={clearImage}
                                className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                            >
                                <X size={16}/>
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <Camera className="mx-auto mb-4" size={32}/>
                        <h2 className="text-lg font-semibold mb-2">
                            Drop your image here
                        </h2>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            or click to upload
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Supports: JPG, PNG, WEBP (max 5MB)
                        </p>
                    </>
                )}

                {isLoading && (
                    <div className={`mt-4 flex items-center justify-center gap-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        <Upload className="animate-bounce" size={16}/>
                        <span>Uploading image...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;