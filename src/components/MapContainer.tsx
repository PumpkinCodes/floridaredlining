import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Eye, EyeOff } from "lucide-react";
import { mapboxService } from "@/services/mapboxService";
import { dataService } from "@/services/dataService";
import mapboxgl from 'mapbox-gl';


interface MapContainerProps {
  city?: string;
  showLayerToggle?: boolean;
  className?: string;
}

export const MapContainer = ({ city, showLayerToggle = true, className = "" }: MapContainerProps) => {
  const [baseMapOpacity, setBaseMapOpacity] = useState(100);
  const [isControlVisible, setIsControlVisible] = useState(true);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);

  // Get city configuration - memoized to prevent infinite rerenders
  const cityConfig = useMemo(() => {
    return city ? dataService.getCityConfig(city) : null;
  }, [city]);

  // Initialize Mapbox
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current || map) return;

      try {
        console.log('Initializing Mapbox map...');
        await mapboxService.initialize();
        
        console.log('Map creation - city:', city, 'cityConfig:', cityConfig);
        
        const newMap = mapboxService.createMap(mapContainer.current, {
          center: cityConfig?.center || [-98.5795, 39.8283], // Center of US for homepage
          zoom: cityConfig?.zoom || 4, // US overview zoom for homepage
          style: 'mapbox://styles/chenerickk/cmewbh2jn00yk01qngriv9yq3'
        });

        // Apply city constraints only if city is provided
        if (city && cityConfig) {
          console.log('Applying city constraints IMMEDIATELY for city:', city);
          console.log('City config bounds:', cityConfig.bounds);
          mapboxService.applyCityConstraints(newMap, city, cityConfig.bounds);
        }

        newMap.on('load', () => {
          console.log('Map loaded successfully for city:', city || 'homepage');
          setIsMapReady(true);
          
          // Double-check constraints are applied after load only for city pages
          if (city && cityConfig) {
            console.log('Double-checking city constraints after load for:', city);
            mapboxService.applyCityConstraints(newMap, city, cityConfig.bounds);
          } else {
            console.log('Homepage map - no constraints applied');
          }
        });

        // Also listen for idle event to ensure map is fully ready
        newMap.on('idle', () => {
          if (!isMapReady) {
            console.log('Map is now idle and ready');
            setIsMapReady(true);
          }
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
        });

        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        setMap(newMap);
        console.log('Map instance created and stored');
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map) {
        try {
          console.log('Cleaning up map for city change:', city);
          setIsMapReady(false);
          // Remove all constraints first
          mapboxService.removeMapConstraints(map);
          // Remove all custom layers and sources
          mapboxService.cleanupAllLayers(map);
          map.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        setMap(null);
      }
    };
  }, [city]); // Use city instead of cityConfig to prevent infinite loop


  const updateBaseMapOpacity = (opacity: number) => {
    setBaseMapOpacity(opacity);
    if (map && isMapReady) {
      mapboxService.setBaseMapOpacity(map, opacity / 100);
    }
  };

  const toggleControlVisibility = () => {
    const newVisibility = !isControlVisible;
    setIsControlVisible(newVisibility);
    
    if (map && isMapReady) {
      // When hiding, set opacity to 0. When showing, restore to slider value
      const targetOpacity = newVisibility ? baseMapOpacity / 100 : 0;
      mapboxService.setBaseMapOpacity(map, targetOpacity);
    }
  };


  return (
    <div className={`relative bg-map-background rounded-lg border ${className}`}>
      {/* Map Container */}
      <div className="h-96 lg:h-[500px] relative rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Loading Overlay */}
        {!isMapReady && (
          <div className="absolute inset-0 bg-map-background/90 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {city ? `Loading ${city.charAt(0).toUpperCase() + city.slice(1)} Map` : "Loading Interactive Map"}
              </h3>
              <p className="text-muted-foreground text-sm">
                Initializing map...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      {showLayerToggle && (
        <Card className="absolute top-4 right-4 p-4 w-64 bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Map Controls</h4>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0"
                onClick={toggleControlVisibility}
              >
                {isControlVisible ? (
                  <Eye className="h-3 w-3 text-primary" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">1930s HOLC Redlining</p>
              </div>
            </div>
            
            {/* Opacity Slider */}
            {isControlVisible && (
              <div className="ml-8 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Opacity</span>
                  <span>{baseMapOpacity}%</span>
                </div>
                <Slider
                  value={[baseMapOpacity]}
                  onValueChange={(value) => updateBaseMapOpacity(value[0])}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};