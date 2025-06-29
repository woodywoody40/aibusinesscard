
import { FaceBoundingBox } from '../types';

export const cropImage = (
  imageUrl: string,
  boundingBox: FaceBoundingBox
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      const { x, y, width, height } = boundingBox;
      const cropX = x * image.naturalWidth;
      const cropY = y * image.naturalHeight;
      const cropWidth = width * image.naturalWidth;
      const cropHeight = height * image.naturalHeight;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.src = imageUrl;
  });
};

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};