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
    
    console.log(`Fetching environmental data for city: ${citySlug}`);

    // Mock environmental data - in real implementation would fetch from EPA EJScreen API
    const mockData = [
      {
        censustract: `${getCityFipsCode(citySlug)}001100`,
        ej_index: 0.45,
        pm25: 9.8,
        ozone: 0.061,
        diesel_pm: 1.2,
        air_toxics_respiratory_hi: 0.6
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001200`,
        ej_index: 0.62,
        pm25: 11.4,
        ozone: 0.067,
        diesel_pm: 1.8,
        air_toxics_respiratory_hi: 0.8
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001300`,
        ej_index: 0.78,
        pm25: 13.9,
        ozone: 0.072,
        diesel_pm: 2.4,
        air_toxics_respiratory_hi: 1.1
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001400`,
        ej_index: 0.89,
        pm25: 16.2,
        ozone: 0.078,
        diesel_pm: 3.1,
        air_toxics_respiratory_hi: 1.4
      }
    ];

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-environmental-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCityFipsCode(citySlug: string): string {
  const fipsCodes: Record<string, string> = {
    'atlanta': '13089',
    'baltimore': '24510',
    'boston': '25025',
    'chicago': '17031',
    'cleveland': '39035', 
    'detroit': '26163',
    'los-angeles': '06037',
    'new-york': '36061',
    'philadelphia': '42101',
    'san-francisco': '06075'
  };
  
  return fipsCodes[citySlug] || '13089';
}