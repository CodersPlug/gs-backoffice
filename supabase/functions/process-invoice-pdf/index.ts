import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    // Get the raw text and sanitize it
    const rawText = await pdfResponse.text();
    console.log('Raw text retrieved, sanitizing...');
    
    // Sanitize text by removing problematic characters and normalizing whitespace
    const pdfText = rawText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\\./g, ' ') // Replace escape sequences with space
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    console.log('Text sanitized successfully');

    // Simple regex patterns for common invoice fields
    const patterns = {
      invoiceNumber: /(?:Invoice|Factura)[\s#:]+([A-Z0-9-]+)/i,
      date: /(?:Date|Fecha)[\s:]+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
      total: /(?:Total|Amount|Monto)[\s:]*[\$€]?\s*([\d,.]+)/i,
      supplier: /(?:From|De|Supplier|Proveedor)[\s:]+([^\n]+)/i,
    };

    // Extract data using regex
    const extractedData = {
      invoiceNumber: pdfText.match(patterns.invoiceNumber)?.[1] || 'Not found',
      date: pdfText.match(patterns.date)?.[1] || 'Not found',
      total: pdfText.match(patterns.total)?.[1] || 'Not found',
      supplier: pdfText.match(patterns.supplier)?.[1] || 'Not found',
    };

    console.log('Extracted data:', extractedData);

    // Format the extracted information
    const formattedInfo = `
Invoice Number: ${extractedData.invoiceNumber}
Date: ${extractedData.date}
Total Amount: ${extractedData.total}
Supplier: ${extractedData.supplier}
    `.trim();

    // Update the kanban item with the extracted information
    const { error: updateError } = await supabase
      .from('kanban_items')
      .update({ 
        description: formattedInfo,
        content: JSON.stringify(extractedData)
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
        extractedData 
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