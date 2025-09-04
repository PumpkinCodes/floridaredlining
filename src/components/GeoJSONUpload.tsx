import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export interface UploadedGeoJSONLayer {
  id: string;
  name: string;
  description?: string;
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  active: boolean;
  uploadedAt: Date;
}

interface GeoJSONUploadProps {
  onLayerAdded: (layer: UploadedGeoJSONLayer) => void;
  onLayerRemoved: (layerId: string) => void;
  uploadedLayers: UploadedGeoJSONLayer[];
  className?: string;
}

const PRESET_COLORS = [
  'hsl(var(--data-critical))',
  'hsl(var(--data-high))',
  'hsl(var(--data-medium))',
  'hsl(var(--data-low))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  'hsl(var(--primary))',
];

export const GeoJSONUpload = ({ 
  onLayerAdded, 
  onLayerRemoved, 
  uploadedLayers, 
  className = '' 
}: GeoJSONUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [layerName, setLayerName] = useState('');
  const [layerDescription, setLayerDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateGeoJSON = (data: any): data is GeoJSON.FeatureCollection => {
    if (!data || typeof data !== 'object') return false;
    if (data.type !== 'FeatureCollection') return false;
    if (!Array.isArray(data.features)) return false;
    
    return data.features.every((feature: any) => 
      feature && 
      feature.type === 'Feature' && 
      feature.geometry && 
      feature.geometry.type
    );
  };

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.geojson') && !file.name.toLowerCase().endsWith('.json')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .geojson or .json file.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateGeoJSON(data)) {
        throw new Error('Invalid GeoJSON format');
      }

      const layerId = `uploaded-${Date.now()}`;
      const name = layerName.trim() || file.name.replace(/\.(geo)?json$/i, '');
      
      const newLayer: UploadedGeoJSONLayer = {
        id: layerId,
        name,
        description: layerDescription.trim() || undefined,
        data,
        color: selectedColor,
        opacity: 0.7,
        active: true,
        uploadedAt: new Date()
      };

      // Save to localStorage
      const savedLayers = JSON.parse(localStorage.getItem('uploadedGeoJSONLayers') || '[]');
      savedLayers.push(newLayer);
      localStorage.setItem('uploadedGeoJSONLayers', JSON.stringify(savedLayers));

      onLayerAdded(newLayer);

      // Reset form
      setLayerName('');
      setLayerDescription('');
      setSelectedColor(PRESET_COLORS[uploadedLayers.length % PRESET_COLORS.length]);

      toast({
        title: "Layer uploaded successfully",
        description: `${name} has been added to the map with ${data.features.length} features.`
      });

    } catch (error) {
      console.error('Error processing GeoJSON file:', error);
      toast({
        title: "Upload failed",
        description: "Please check that your file contains valid GeoJSON data.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [layerName, layerDescription, selectedColor, onLayerAdded, uploadedLayers.length, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const geoJsonFile = files.find(file => 
      file.name.toLowerCase().endsWith('.geojson') || 
      file.name.toLowerCase().endsWith('.json')
    );
    
    if (geoJsonFile) {
      processFile(geoJsonFile);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const removeLayer = useCallback((layerId: string) => {
    // Remove from localStorage
    const savedLayers = JSON.parse(localStorage.getItem('uploadedGeoJSONLayers') || '[]');
    const filteredLayers = savedLayers.filter((layer: UploadedGeoJSONLayer) => layer.id !== layerId);
    localStorage.setItem('uploadedGeoJSONLayers', JSON.stringify(filteredLayers));

    onLayerRemoved(layerId);
    
    toast({
      title: "Layer removed",
      description: "The layer has been removed from the map."
    });
  }, [onLayerRemoved, toast]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Interface */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Upload className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Upload GeoJSON Data</h3>
          </div>

          {/* Layer Configuration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="layerName" className="text-xs">Layer Name</Label>
              <Input
                id="layerName"
                placeholder="Custom Layer"
                value={layerName}
                onChange={(e) => setLayerName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="layerDescription" className="text-xs">Description (Optional)</Label>
              <Input
                id="layerDescription"
                placeholder="Layer description"
                value={layerDescription}
                onChange={(e) => setLayerDescription(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-xs">Layer Color</Label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <FileText className={`h-8 w-8 mx-auto ${
                isDragging ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className="text-sm font-medium">
                {isDragging ? 'Drop your GeoJSON file here' : 'Drag & drop GeoJSON file'}
              </p>
              <p className="text-xs text-muted-foreground">
                or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                  disabled={isProcessing}
                >
                  browse files
                </button>
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Processing GeoJSON file...
            </div>
          )}
        </div>
      </Card>

      {/* Uploaded Layers List */}
      {uploadedLayers.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h3 className="font-semibold text-sm">Uploaded Layers</h3>
            <Badge variant="secondary" className="text-xs">
              {uploadedLayers.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {uploadedLayers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className="w-3 h-3 rounded border"
                    style={{ backgroundColor: layer.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{layer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {layer.data.features.length} features
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeLayer(layer.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};