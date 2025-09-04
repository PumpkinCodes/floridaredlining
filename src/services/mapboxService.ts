import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapboxService {
  private static instance: MapboxService;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): MapboxService {
    if (!MapboxService.instance) {
      MapboxService.instance = new MapboxService();
    }
    return MapboxService.instance;
  }

  public async initialize(): Promise<void> {
    if (!this.accessToken) {
      try {
        // Fetch token from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (!error && data?.token) {
          this.accessToken = data.token;
        } else {
          console.warn('Could not fetch Mapbox token:', error);
          this.accessToken = 'pk.placeholder_token';
        }
      } catch (error) {
        console.warn('Error fetching Mapbox token:', error);
        this.accessToken = 'pk.placeholder_token';
      }
      
      mapboxgl.accessToken = this.accessToken;
    }
  }

  public createMap(container: HTMLDivElement, options: {
    center: [number, number];
    zoom: number;
    style?: string;
    maxBounds?: mapboxgl.LngLatBoundsLike;
    minZoom?: number;
    maxZoom?: number;
  }): mapboxgl.Map {
    if (!this.accessToken || this.accessToken === 'pk.placeholder_token') {
      console.error('Valid Mapbox token required.');
      throw new Error('Mapbox token not configured');
    }

    const map = new mapboxgl.Map({
      container,
      style: options.style || 'mapbox://styles/chenerickk/cmewbh2jn00yk01qngriv9yq3',
      center: options.center,
      zoom: options.zoom,
      attributionControl: true,
      ...(options.maxBounds && { maxBounds: options.maxBounds }),
      ...(options.minZoom && { minZoom: options.minZoom }),
      ...(options.maxZoom && { maxZoom: options.maxZoom })
    });

    console.log('Map created successfully with style:', options.style || 'mapbox://styles/chenerickk/cmewbh2jn00yk01qngriv9yq3');
    
    return map;
  }

  public addHOLCLayer(map: mapboxgl.Map, data: GeoJSON.FeatureCollection): void {
    // Wait for both style and map to be fully loaded
    if (!map.isStyleLoaded() || !map.loaded()) {
      console.log('Map not fully ready, waiting...', { 
        styleLoaded: map.isStyleLoaded(), 
        mapLoaded: map.loaded() 
      });
      
      // Use 'idle' event which fires when map is fully loaded and idle
      map.once('idle', () => {
        this.addHOLCLayer(map, data);
      });
      return;
    }

    console.log('Adding HOLC layer with', data.features?.length, 'features');

    // Safely check and remove existing layer/source
    try {
      if (map.getLayer('holc-layer')) {
        console.log('Removing existing HOLC layer');
        map.removeLayer('holc-layer');
      }
    } catch (e) {
      console.log('Layer holc-layer does not exist yet');
    }
    
    try {
      if (map.getSource('holc-data')) {
        console.log('Removing existing HOLC source');
        map.removeSource('holc-data');
      }
    } catch (e) {
      console.log('Source holc-data does not exist yet');
    }

    map.addSource('holc-data', {
      type: 'geojson',
      data: data
    });

    map.addLayer({
      id: 'holc-layer',
      type: 'fill',
      source: 'holc-data',
      paint: {
        'fill-color': [
          'match',
          ['get', 'grade'],
          'A', '#4ade80', // green
          'B', '#3b82f6', // blue  
          'C', '#eab308', // yellow
          'D', '#ef4444', // red
          '#6b7280' // fallback gray
        ],
        'fill-opacity': 0.6,
        'fill-outline-color': '#000000'
      }
    });

    console.log('HOLC layer added successfully');
  }

  public addChoroplethLayer(
    map: mapboxgl.Map, 
    layerId: string,
    data: GeoJSON.FeatureCollection,
    colorProperty: string,
    colorScale: string[]
  ): void {
    // Wait for style to load before manipulating sources
    if (!map.isStyleLoaded()) {
      console.log('Style not loaded yet for choropleth, waiting...');
      map.once('styledata', () => {
        this.addChoroplethLayer(map, layerId, data, colorProperty, colorScale);
      });
      return;
    }

    // Safely check and remove existing layer/source
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(layerId)) {
      map.removeSource(layerId);
    }

    map.addSource(layerId, {
      type: 'geojson',
      data: data
    });

    map.addLayer({
      id: layerId,
      type: 'fill',
      source: layerId,
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', colorProperty],
          0, colorScale[0],
          0.25, colorScale[1],
          0.5, colorScale[2],
          0.75, colorScale[3],
          1, colorScale[4]
        ],
        'fill-opacity': 0.7,
        'fill-outline-color': '#ffffff'
      }
    });
  }

  public toggleLayerVisibility(map: mapboxgl.Map, layerId: string, visible: boolean): void {
    if (!map.isStyleLoaded()) return;
    
    const visibility = visible ? 'visible' : 'none';
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  }

  public setLayerOpacity(map: mapboxgl.Map, layerId: string, opacity: number): void {
    if (!map.isStyleLoaded()) return;
    
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'fill-opacity', opacity);
    }
  }

  public addGeoJSONLayer(
    map: mapboxgl.Map,
    layerId: string,
    data: GeoJSON.FeatureCollection,
    options: {
      color: string;
      opacity: number;
      strokeColor?: string;
      strokeWidth?: number;
    }
  ): void {
    if (!map.isStyleLoaded() || !map.loaded()) {
      console.log('Map not ready for GeoJSON layer, waiting...', { 
        styleLoaded: map.isStyleLoaded(), 
        mapLoaded: map.loaded() 
      });
      
      map.once('idle', () => {
        this.addGeoJSONLayer(map, layerId, data, options);
      });
      return;
    }

    console.log('Adding GeoJSON layer:', layerId, 'with', data.features?.length, 'features');

    // Remove existing layer/source if present
    try {
      if (map.getLayer(layerId)) {
        console.log('Removing existing layer:', layerId);
        map.removeLayer(layerId);
      }
    } catch (e) {
      console.log('Layer', layerId, 'does not exist yet');
    }
    
    try {
      if (map.getSource(layerId)) {
        console.log('Removing existing source:', layerId);
        map.removeSource(layerId);
      }
    } catch (e) {
      console.log('Source', layerId, 'does not exist yet');
    }

    // Add source
    map.addSource(layerId, {
      type: 'geojson',
      data: data
    });

    // Add layer based on geometry type
    const geometryType = data.features[0]?.geometry?.type;
    
    if (geometryType === 'Point' || geometryType === 'MultiPoint') {
      map.addLayer({
        id: layerId,
        type: 'circle',
        source: layerId,
        paint: {
          'circle-color': options.color,
          'circle-opacity': options.opacity,
          'circle-radius': 6,
          'circle-stroke-color': options.strokeColor || '#ffffff',
          'circle-stroke-width': options.strokeWidth || 1
        }
      });
    } else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
      map.addLayer({
        id: layerId,
        type: 'line',
        source: layerId,
        paint: {
          'line-color': options.color,
          'line-opacity': options.opacity,
          'line-width': options.strokeWidth || 2
        }
      });
    } else {
      // Polygon or MultiPolygon
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: layerId,
        paint: {
          'fill-color': options.color,
          'fill-opacity': options.opacity,
          'fill-outline-color': options.strokeColor || '#ffffff'
        }
      });
    }

    console.log('GeoJSON layer added successfully:', layerId);
  }

  public removeLayer(map: mapboxgl.Map, layerId: string): void {
    if (!map.isStyleLoaded()) return;

    try {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(layerId)) {
        map.removeSource(layerId);
      }
      console.log('Layer removed:', layerId);
    } catch (error) {
      console.warn('Error removing layer:', layerId, error);
    }
  }

  public setBaseMapOpacity(map: mapboxgl.Map, opacity: number): void {
    if (!map.isStyleLoaded()) return;
    
    const style = map.getStyle();
    if (!style?.layers) return;

    // Target common base map layer types and set their opacity
    style.layers.forEach(layer => {
      // Skip data layers we've added
      if (layer.id.includes('holc-') || 
          layer.id === 'holc-layer' || 
          layer.id.includes('mortgage') ||
          layer.id.includes('demographics') ||
          layer.id.includes('evictions') ||
          layer.id.includes('environmental')) {
        return;
      }

      try {
        if (layer.type === 'fill') {
          map.setPaintProperty(layer.id, 'fill-opacity', opacity);
        } else if (layer.type === 'line') {
          map.setPaintProperty(layer.id, 'line-opacity', opacity);
        } else if (layer.type === 'symbol') {
          map.setPaintProperty(layer.id, 'text-opacity', opacity);
          map.setPaintProperty(layer.id, 'icon-opacity', opacity);
        } else if (layer.type === 'raster') {
          map.setPaintProperty(layer.id, 'raster-opacity', opacity);
        } else if (layer.type === 'background') {
          map.setPaintProperty(layer.id, 'background-opacity', opacity);
        }
      } catch (error) {
        // Some properties might not exist for certain layers
        console.debug(`Could not set opacity for layer ${layer.id}:`, error);
      }
    });
  }

  public fitBoundsToGeoJSON(map: mapboxgl.Map, data: GeoJSON.FeatureCollection): void {
    if (!data.features.length) return;

    const bounds = new mapboxgl.LngLatBounds();
    
    data.features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        bounds.extend(feature.geometry.coordinates as [number, number]);
      } else if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates[0].forEach(coord => {
          bounds.extend(coord as [number, number]);
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          polygon[0].forEach(coord => {
            bounds.extend(coord as [number, number]);
          });
        });
      } else if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(coord => {
          bounds.extend(coord as [number, number]);
        });
      } else if (feature.geometry.type === 'MultiLineString') {
        feature.geometry.coordinates.forEach(line => {
          line.forEach(coord => {
            bounds.extend(coord as [number, number]);
          });
        });
      }
    });

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000
    });
  }

  public applyCityConstraints(map: mapboxgl.Map, citySlug: string, cityBounds: { north: number; south: number; east: number; west: number }): void {
    console.log('Applying constraints for city:', citySlug, 'bounds:', cityBounds);
    
    // Remove existing constraints first
    this.removeMapConstraints(map);
    
    // Set maximum bounds to prevent panning outside the city
    const maxBounds: [number, number, number, number] = [
      cityBounds.west - 0.05, // Add small buffer
      cityBounds.south - 0.05,
      cityBounds.east + 0.05,
      cityBounds.north + 0.05
    ];
    
    map.setMaxBounds(maxBounds);
    
    // Set zoom constraints
    map.setMinZoom(8);  // Prevent zooming out too far
    map.setMaxZoom(16); // Prevent zooming in too close
    
    console.log(`Applied ${citySlug} map constraints:`, { maxBounds, minZoom: 8, maxZoom: 16 });
  }

  public removeMapConstraints(map: mapboxgl.Map): void {
    console.log('Removing map constraints');
    // Reset to default bounds (world view)
    map.setMaxBounds(null);
    // Reset zoom constraints to defaults
    map.setMinZoom(0);
    map.setMaxZoom(22);
  }

  public cleanupAllLayers(map: mapboxgl.Map): void {
    console.log('Cleaning up all custom layers and sources');
    
    // Force wait for map to be ready before cleanup
    if (!map.isStyleLoaded()) {
      console.log('Map style not loaded, waiting before cleanup...');
      map.once('styledata', () => {
        this.cleanupAllLayers(map);
      });
      return;
    }

    try {
      const style = map.getStyle();
      if (style?.sources) {
        // Create arrays to avoid modifying while iterating
        const sourcesToRemove: string[] = [];
        const layersToRemove: string[] = [];
        
        // Collect all custom sources and layers
        Object.keys(style.sources).forEach(sourceId => {
          if (sourceId.includes('holc') || sourceId.includes('mortgage') || 
              sourceId.includes('demographic') || sourceId.includes('eviction') || 
              sourceId.includes('environmental')) {
            sourcesToRemove.push(sourceId);
          }
        });

        // Collect layers that use these sources
        const layers = style.layers || [];
        layers.forEach(layer => {
          if (sourcesToRemove.includes(layer.source as string) || 
              layer.id.includes('holc-') || layer.id === 'holc-layer') {
            layersToRemove.push(layer.id);
          }
        });

        // Remove layers first
        layersToRemove.forEach(layerId => {
          try {
            if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
              console.log('Removed layer:', layerId);
            }
          } catch (e) {
            console.debug('Layer already removed:', layerId);
          }
        });

        // Then remove sources
        sourcesToRemove.forEach(sourceId => {
          try {
            if (map.getSource(sourceId)) {
              map.removeSource(sourceId);
              console.log('Removed source:', sourceId);
            }
          } catch (e) {
            console.debug('Source already removed:', sourceId);
          }
        });
      }
    } catch (error) {
      console.warn('Error during layer cleanup:', error);
    }
  }
}

export const mapboxService = MapboxService.getInstance();