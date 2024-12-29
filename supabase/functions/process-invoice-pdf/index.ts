import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Document } from "https://deno.land/x/pdf@v0.1.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfUrl } = await req.json();
    
    if (!pdfUrl) {
      throw new Error('No PDF URL provided');
    }

    console.log('Processing PDF from URL:', pdfUrl);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the PDF content
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    
    // Load the PDF document using the Deno PDF library
    const document = new Document(pdfArrayBuffer);
    const pages = document.getPages();
    
    // Convert first page to PNG
    const firstPage = pages[0];
    const pngData = await firstPage.render({
      format: "png",
      scale: 2.0, // Higher scale for better quality
    });

    // Convert PNG data to base64
    const base64Image = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(pngData)))}`;

    // Call OpenAI API with the converted image
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                  url: base64Image
                }
              }
            ]
          }
        ]
      })
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI API response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const extractedInfo = data.choices[0].message.content;

    // Update the kanban item with the extracted information
    const { error: updateError } = await supabase
      .from('kanban_items')
      .update({ 
        description: extractedInfo,
        content: extractedInfo
      })
      .eq('source_info', pdfUrl);

    if (updateError) {
      console.error('Error updating item:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'PDF processed successfully',
        extractedInfo 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
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
        status: 500
      }
    );
  }
});