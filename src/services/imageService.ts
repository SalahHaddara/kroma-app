import axios from 'axios';

const API_URL = 'http://localhost:3000';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
}

export interface DesignResponse {
    prompt: string;
    designSystem: {
        colors: string[];
        typography: {
            fontFamily: string;
            fontSize: string;
        };
    };
    inspirationImages: string[];
}

export const validateImage = (file: File): ImageValidationResult => {
    if (!file.type.startsWith('image/')) {
        return {
            isValid: false,
            error: 'File must be an image'
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: 'Image must be less than 5MB'
        };
    }

    return {isValid: true};
};

export const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                let width = img.width;
                let height = img.height;
                const maxDimension = 1200;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not compress image'));
                            return;
                        }
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    0.8
                );
            };
        };
        reader.onerror = (error) => reject(error);
    });
};

export const processImage = async (imageFile: File): Promise<DesignResponse> => {
    try {
        const validationResult = validateImage(imageFile);
        if (!validationResult.isValid) {
            throw new Error(validationResult.error);
        }

        const processedFile = await compressImage(imageFile);

        const formData = new FormData();
        formData.append('image', processedFile);

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await axios.post<DesignResponse>(
            `${API_URL}/get-design/generate-from-image`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to process image');
        }
        throw error;
    }
};