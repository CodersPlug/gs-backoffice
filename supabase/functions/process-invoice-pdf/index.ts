import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfUrl } = await req.json();
    
    if (!pdfUrl) {
      throw new Error('No PDF URL provided');
    }

    console.log('Processing PDF from URL:', pdfUrl);

    // Download the PDF content
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    console.log('PDF downloaded and converted to base64');

    // Implement retry logic for OpenAI API
    let retries = 3;
    let openAIResponse;
    let error;

    while (retries > 0) {
      try {
        console.log(`Attempting OpenAI API call. Retries left: ${retries}`);
        openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Extract key information from invoices in a clear format. Focus on essential details only."
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Extract the following information from this invoice: date, invoice number, total amount, supplier details, and line items."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:application/pdf;base64,${pdfBase64}`,
                      detail: "high"
                    }
                  }
                ]
              }
            ],
            max_tokens: 500,
          }),
        });

        if (!openAIResponse.ok) {
          const errorData = await openAIResponse.text();
          throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorData}`);
        }

        break; // Success, exit retry loop
      } catch (e) {
        error = e;
        retries--;
        if (retries > 0) {
          console.log(`OpenAI API call failed. Retrying in 2 seconds...`);
          await delay(2000); // Wait 2 seconds before retrying
        }
      }
    }

    if (!openAIResponse?.ok) {
      throw error || new Error('Failed to process PDF after all retries');
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response received:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const extractedInfo = data.choices[0].message.content;

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update the kanban item with the extracted information
    const { error: updateError } = await supabase
      .from('kanban_items')
      .update({ 
        description: extractedInfo,
      })
      .eq('source_info', pdfUrl);

    if (updateError) {
      console.error('Error updating item:', updateError);
      throw updateError;
    }

    console.log('Successfully updated kanban item with extracted information');

    return new Response(
      JSON.stringify({ 
        message: 'PDF processed successfully',
        extractedInfo 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error processing PDF', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
  }
});