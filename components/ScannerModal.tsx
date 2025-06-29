import React, { useState, useRef, useEffect, useCallback } from 'react';
import { scanCard } from '../services/geminiService';
import { Contact } from '../types';
import { Spinner } from './Spinner';
import { Icon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface ScannerModalProps {
  apiKey: string;
  onClose: () => void;
  onScanSuccess: (data: Omit<Contact, 'id' | 'createdAt'>) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ apiKey, onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("無法啟動相機。請確認您已授權相機權限。");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageSrc(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setImageSrc(null);
    setError(null);
    startCamera();
  };

  const handleScan = async () => {
    if (!imageSrc || !apiKey) return;
    setIsScanning(true);
    setError(null);
    try {
      const partialContact = await scanCard(imageSrc, apiKey);
      onScanSuccess(partialContact);
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤。");
      setIsScanning(false);
    } 
  };

  const viewVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <div className="fixed inset-0 bg-morandi-10/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-neo-medium w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-bg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border flex-shrink-0">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">掃描名片</h2>
          <button onClick={onClose} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-black/10 dark:hover:bg-white/10">
            <Icon icon="x" className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          {isScanning ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Spinner text="AI 正在分析名片..." />
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">這可能需要幾秒鐘的時間</p>
            </div>
          ) : (
            <>
              <div className="relative w-full aspect-[16/10] bg-morandi-10/90 rounded-lg overflow-hidden flex items-center justify-center border border-light-border dark:border-dark-border">
                <AnimatePresence initial={false} mode="wait">
                  {imageSrc ? (
                    <motion.img
                      key="image"
                      src={imageSrc}
                      alt="Captured business card"
                      className="object-contain max-h-full max-w-full absolute inset-0 w-full h-full"
                      variants={viewVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <motion.video
                      key="video"
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover absolute inset-0 w-full h-full"
                       variants={viewVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    ></motion.video>
                  )}
                </AnimatePresence>
                {!imageSrc && !error && <div className="absolute inset-0 border-4 border-white/20 border-dashed rounded-lg"></div>}
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
              
              {error && <div className="mt-4 text-center text-red-500 dark:text-red-400 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">{error}</div>}

              <div className="mt-6 flex justify-center gap-4">
                {imageSrc ? (
                  <>
                    <button onClick={handleRetake} className="px-6 py-3 rounded-full font-semibold text-light-text dark:text-dark-text bg-light-border/50 dark:bg-dark-border/50 hover:bg-light-border dark:hover:bg-dark-border transition-colors">
                      重新拍攝
                    </button>
                    <button onClick={handleScan} className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-br from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary hover:opacity-90 transition-opacity">
                      確認並掃描
                    </button>
                  </>
                ) : (
                   <button onClick={handleCapture} className="w-20 h-20 rounded-full font-bold text-white bg-light-primary dark:bg-dark-primary hover:opacity-90 transform hover:scale-105 transition-all flex items-center justify-center ring-4 ring-white/20">
                    <Icon icon="camera" className="w-8 h-8"/>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};