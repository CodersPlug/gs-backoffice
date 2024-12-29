import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';

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
    
    // Configure PDF.js for Deno environment
    const pdfjsWorker = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js');
    globalThis.pdfjsWorker = pdfjsWorker;
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfArrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get the first page
    const page = await pdf.getPage(1);
    
    // Extract text content
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');

    // Simple regex patterns for common invoice fields
    const patterns = {
      invoiceNumber: /(?:Invoice|Factura)[\s#:]+([A-Z0-9-]+)/i,
      date: /(?:Date|Fecha)[\s:]+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
      total: /(?:Total|Amount|Monto)[\s:]*[\$€]?\s*([\d,.]+)/i,
      supplier: /(?:From|De|Supplier|Proveedor)[\s:]+([^\n]+)/i,
    };

    // Extract data using regex
    const extractedData = {
      invoiceNumber: text.match(patterns.invoiceNumber)?.[1] || 'Not found',
      date: text.match(patterns.date)?.[1] || 'Not found',
      total: text.match(patterns.total)?.[1] || 'Not found',
      supplier: text.match(patterns.supplier)?.[1] || 'Not found',
      rawText: text // Include raw text for debugging
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
        content: JSON.stringify(extractedData, null, 2)
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