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
    
    console.log(`Fetching mortgage data for city: ${citySlug}`);

    // Mock mortgage data - in real implementation would fetch from HMDA API
    const mockData = [
      {
        censustract: `${getCityFipsCode(citySlug)}001100`,
        denial_rate_white: 0.08,
        denial_rate_black: 0.18,
        denial_rate_hispanic: 0.14,
        denial_rate_asian: 0.06,
        total_applications: 425
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001200`,
        denial_rate_white: 0.12,
        denial_rate_black: 0.24,
        denial_rate_hispanic: 0.19,
        denial_rate_asian: 0.09,
        total_applications: 312
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001300`,
        denial_rate_white: 0.15,
        denial_rate_black: 0.31,
        denial_rate_hispanic: 0.23,
        denial_rate_asian: 0.11,
        total_applications: 278
      },
      {
        censustract: `${getCityFipsCode(citySlug)}001400`,
        denial_rate_white: 0.22,
        denial_rate_black: 0.41,
        denial_rate_hispanic: 0.35,
        denial_rate_asian: 0.18,
        total_applications: 189
      }
    ];

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-mortgage-data:', error);
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