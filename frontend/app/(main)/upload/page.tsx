'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Sparkles, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOutfitStore } from '@/store/outfit.store';
import { outfitsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

const ANALYSIS_STEPS = [
  'Scanning your outfit...',
  'Detecting vibe and style...',
  'Analyzing colors and fit...',
  'Calculating scores...',
  'Writing your roast...',
  'Almost done...',
];

export default function UploadPage() {
  const router = useRouter();
  const { setCurrentOutfit, setAnalyzing, setPreviewUrl, isAnalyzing, previewUrl } =
    useOutfitStore();

  const [file, setFile] = useState<File | null>(null);
  const [roastMode, setRoastMode] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [title, setTitle] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }, [setPreviewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isAnalyzing,
  });

  async function handleAnalyze() {
    if (!file) return toast.error('Please select an image first');

    setAnalyzing(true);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((i) => (i < ANALYSIS_STEPS.length - 1 ? i + 1 : i));
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('roastMode', String(roastMode));
      formData.append('isPublic', String(isPublic));
      if (title) formData.append('title', title);

      const { data } = await outfitsApi.upload(formData);
      setCurrentOutfit(data.data);
      toast.success('Analysis complete! 🔥');
      router.push(`/outfit/${data.data.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || 'Analysis failed, try again');
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black text-white mb-2">Rate my outfit</h1>
          <p className="text-white/40">Drop a photo. Get roasted. Glow up.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin [animation-duration:2s]" />
                <div className="absolute inset-1 rounded-full bg-[#080808] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-3">AI is judging...</h2>
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white/40 text-sm"
                >
                  {ANALYSIS_STEPS[stepIndex]}
                </motion.p>
              </AnimatePresence>

              {previewUrl && (
                <div className="mt-6 relative w-32 h-32 mx-auto rounded-2xl overflow-hidden opacity-50">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Drop zone */}
              <div
                {...getRootProps()}
                className={`glass rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />

                {previewUrl ? (
                  <div className="relative">
                    <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-white/40 text-sm mt-4">Click to change photo</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-7 h-7 text-white/30" />
                    </div>
                    <p className="text-white font-semibold mb-1">
                      {isDragActive ? 'Drop it here!' : 'Drop your outfit here'}
                    </p>
                    <p className="text-white/30 text-sm">
                      JPG, PNG, WebP up to 10MB
                    </p>
                  </>
                )}
              </div>

              {/* Title */}
              <input
                type="text"
                placeholder="Give your fit a title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-purple-500/50 transition-colors"
              />

              {/* Options */}
              <div className="flex gap-3">
                <button
                  onClick={() => setRoastMode(!roastMode)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    roastMode
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                      : 'glass border border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Roast mode {roastMode ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isPublic
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                      : 'glass border border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  {isPublic ? '🌍 Public' : '🔒 Private'}
                </button>
              </div>

              <Button
                onClick={handleAnalyze}
                className="w-full"
                size="lg"
                variant="glow"
                disabled={!file || isAnalyzing}
              >
                <Zap className="w-4 h-4" />
                Analyze my outfit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
