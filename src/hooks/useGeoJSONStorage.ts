import { useState, useEffect, useCallback } from 'react';
import type { UploadedGeoJSONLayer } from '@/types/map';

const STORAGE_KEY = 'uploadedGeoJSONLayers';

export const useGeoJSONStorage = () => {
  const [uploadedLayers, setUploadedLayers] = useState<UploadedGeoJSONLayer[]>([]);

  // Load layers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert uploadedAt strings back to Date objects
        const layersWithDates = parsed.map((layer: any) => ({
          ...layer,
          uploadedAt: new Date(layer.uploadedAt)
        }));
        setUploadedLayers(layersWithDates);
      }
    } catch (error) {
      console.error('Error loading uploaded layers from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addLayer = useCallback((layer: UploadedGeoJSONLayer) => {
    setUploadedLayers(prev => {
      const updated = [...prev, layer];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setUploadedLayers(prev => {
      const updated = prev.filter(layer => layer.id !== layerId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<UploadedGeoJSONLayer>) => {
    setUploadedLayers(prev => {
      const updated = prev.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllLayers = useCallback(() => {
    setUploadedLayers([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportLayers = useCallback(() => {
    return uploadedLayers;
  }, [uploadedLayers]);

  const importLayers = useCallback((layers: UploadedGeoJSONLayer[]) => {
    setUploadedLayers(layers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layers));
  }, []);

  return {
    uploadedLayers,
    addLayer,
    removeLayer,
    updateLayer,
    clearAllLayers,
    exportLayers,
    importLayers
  };
};