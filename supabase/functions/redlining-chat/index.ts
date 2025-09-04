import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, location } = await req.json();
    console.log('Received chat request for location:', location);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create location-aware system prompt
    const systemPrompt = `You are an expert AI assistant specializing in redlining and housing discrimination history. Your role is to educate users about:

1. **Historical Context**: The Home Owners' Loan Corporation (HOLC) redlining maps from the 1930s-1960s that systematically excluded Black and minority neighborhoods from federal housing loans and investments.

2. **Current Impact**: How historical redlining continues to affect communities today through:
   - Persistent wealth gaps and homeownership disparities
   - Environmental justice issues (pollution, lack of green space)
   - Health disparities and food access
   - Educational resource differences
   - Infrastructure and transportation inequities

3. **Location-Specific Insights**: When users mention a specific location, provide relevant information about:
   - Historical HOLC grade designations if known (A=Green, B=Blue, C=Yellow, D=Red)
   - Current demographic and economic patterns
   - Specific examples of redlining's lasting effects in that area
   - Community resilience and ongoing advocacy efforts

**Guidelines**:
- Use accessible language to explain complex historical and economic concepts
- Be sensitive to the serious social justice implications of redlining
- Provide accurate, factual information based on historical records
- Suggest credible sources for further reading when appropriate
- Acknowledge when you don't have specific data about a location
- Focus on education and awareness while being respectful of affected communities
- Encourage users to learn more and get involved in housing justice advocacy

**Current conversation context**: ${location ? `The user is asking about ${location}` : 'General redlining discussion'}

Remember: Redlining wasn't just about maps - it was a systematic policy that created and reinforced racial segregation and economic inequality that persists today.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_completion_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in redlining-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});