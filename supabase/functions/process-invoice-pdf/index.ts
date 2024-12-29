import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { parse } from 'https://esm.sh/pdf-parse@1.1.1';

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

    // Fetch the PDF content as an ArrayBuffer
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log('PDF fetched successfully, extracting text...');

    // Extract text from PDF
    const data = await parse(new Uint8Array(pdfBuffer));
    const extractedText = data.text;
    console.log('Extracted text:', extractedText);

    // Get the filename from the URL
    const filename = pdfUrl.split('/').pop() || 'document.pdf';
    
    // Create description with extracted text preview
    const textPreview = extractedText.slice(0, 200) + (extractedText.length > 200 ? '...' : '');
    const description = `PDF document: ${filename}\n\nPreview: ${textPreview}`;
    
    // Update the kanban item with extracted information
    const { error: updateError } = await supabase
      .from('kanban_items')
      .update({ 
        description: description,
        content: JSON.stringify({
          filename,
          uploadDate: new Date().toISOString(),
          fileType: 'PDF',
          fullText: extractedText
        })
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
        description,
        extractedText 
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