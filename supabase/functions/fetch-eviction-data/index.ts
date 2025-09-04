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
    
    console.log(`Fetching eviction data for city: ${citySlug}`);

    // Mock eviction data - in real implementation would fetch from Eviction Lab API
    const mockData = [
      {
        censustract: `${getCityFipsCode(citySlug)}001100`,
        eviction_rate: 2.8,
        eviction_filings: 89,
        renter_occupied_households: 3180,
        year: 2023
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001200`, 
        eviction_rate: 4.2,
        eviction_filings: 156,
        renter_occupied_households: 3714,
        year: 2023
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001300`,
        eviction_rate: 6.7,
        eviction_filings: 298,
        renter_occupied_households: 4448,
        year: 2023
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001400`,
        eviction_rate: 9.1,
        eviction_filings: 412,
        renter_occupied_households: 4527,
        year: 2023
      }
    ];

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-eviction-data:', error);
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