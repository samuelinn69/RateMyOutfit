import { create } from 'zustand';
import { Outfit } from '@/lib/types';

interface OutfitState {
  currentOutfit: Outfit | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  previewUrl: string | null;

  setCurrentOutfit: (outfit: Outfit | null) => void;
  setAnalyzing: (state: boolean) => void;
  setProgress: (p: number) => void;
  setPreviewUrl: (url: string | null) => void;
  reset: () => void;
}

export const useOutfitStore = create<OutfitState>((set) => ({
  currentOutfit: null,
  isAnalyzing: false,
  analysisProgress: 0,
  previewUrl: null,

  setCurrentOutfit: (outfit) => set({ currentOutfit: outfit }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setProgress: (analysisProgress) => set({ analysisProgress }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  reset: () =>
    set({ currentOutfit: null, isAnalyzing: false, analysisProgress: 0, previewUrl: null }),
}));
