import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { citySlug } = await req.json();
    
    console.log(`Fetching HOLC data for city: ${citySlug}`);

    // In a real implementation, this would fetch from Mapping Inequality API
    // For now, return mock GeoJSON data based on city
    const mockData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            grade: 'A',
            neighborhood: `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)} Downtown`,
            description: 'Best residential area with modern amenities',
            holc_id: `${citySlug}_001`
          },
          geometry: {
            type: 'Polygon',
            coordinates: getCityPolygonCoords(citySlug)
          }
        },
        {
          type: 'Feature', 
          properties: {
            grade: 'B',
            neighborhood: `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)} Midtown`,
            description: 'Still desirable residential area',
            holc_id: `${citySlug}_002`
          },
          geometry: {
            type: 'Polygon',
            coordinates: getCityPolygonCoords(citySlug, 0.01)
          }
        },
        {
          type: 'Feature',
          properties: {
            grade: 'C', 
            neighborhood: `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)} East Side`,
            description: 'Declining area with older housing',
            holc_id: `${citySlug}_003`
          },
          geometry: {
            type: 'Polygon',
            coordinates: getCityPolygonCoords(citySlug, 0.02)
          }
        },
        {
          type: 'Feature',
          properties: {
            grade: 'D',
            neighborhood: `${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)} South Side`,
            description: 'Hazardous area with undesirable population',
            holc_id: `${citySlug}_004`
          },
          geometry: {
            type: 'Polygon', 
            coordinates: getCityPolygonCoords(citySlug, 0.03)
          }
        }
      ]
    };

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-holc-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCityPolygonCoords(citySlug: string, offset = 0): number[][][] {
  const cityCoords: Record<string, [number, number]> = {
    'atlanta': [-84.39, 33.75],
    'baltimore': [-76.61, 39.29],
    'boston': [-71.06, 42.36],
    'chicago': [-87.63, 41.88],
    'cleveland': [-81.69, 41.50],
    'detroit': [-83.05, 42.33],
    'los-angeles': [-118.24, 34.05],
    'new-york': [-73.99, 40.73],
    'philadelphia': [-75.17, 39.95],
    'san-francisco': [-122.42, 37.77]
  };

  const [lng, lat] = cityCoords[citySlug] || [-84.39, 33.75];
  const size = 0.02; // Optimal size for visibility
  
  // Create non-overlapping polygons by positioning them in different quadrants
  const positions = [
    { x: -0.5, y: 0.5 },  // Grade A: Northwest
    { x: 0.5, y: 0.5 },   // Grade B: Northeast  
    { x: -0.5, y: -0.5 }, // Grade C: Southwest
    { x: 0.5, y: -0.5 }   // Grade D: Southeast
  ];
  
  const gradeIndex = Math.floor(offset / 0.01); // 0, 1, 2, 3 for grades A, B, C, D
  const pos = positions[gradeIndex] || positions[0];
  
  const centerLng = lng + (pos.x * size * 2);
  const centerLat = lat + (pos.y * size * 2);
  
  return [[
    [centerLng - size, centerLat - size],
    [centerLng + size, centerLat - size],  
    [centerLng + size, centerLat + size],
    [centerLng - size, centerLat + size],
    [centerLng - size, centerLat - size]
  ]];
}