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
      console.log(`Getting Mapbox access token from secrets`);
      
      let mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN');
      
      // Fallback to the user's token if not in secrets
      if (!mapboxToken) {
        console.log('Using fallback token');
        mapboxToken = 'pk.eyJ1IjoiY2hlbmVyaWNrayIsImEiOiJjbWV3YmQ0MTAwbGZ5Mm5weGtxbnk2azJqIn0.G9oAOJL87kA6_JAneJtHpw';
      }
      
      console.log('Mapbox token found, length:', mapboxToken.length);

      return new Response(JSON.stringify({ 
        token: mapboxToken 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  } catch (error) {
    console.error('Error in get-mapbox-token:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      token: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});