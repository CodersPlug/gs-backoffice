import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting PDF processing...');
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { pdfUrl } = await req.json()
    
    if (!pdfUrl) {
      throw new Error('No PDF URL provided')
    }

    console.log('Processing PDF from URL:', pdfUrl);

    // Download the PDF content
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }
    
    const pdfBuffer = await response.arrayBuffer()
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)))

    console.log('PDF downloaded and converted to base64');

    // Use OpenAI to extract information
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
            content: `Eres un experto en extraer información de Facturas de Compra.
            Extrae y formatea la siguiente información de manera clara y estructurada:

            HEADER:
            - Fecha
            - Número de orden de compra
            - Proveedor (nombre y CUIT)
            - Cliente (nombre y CUIT)
            - Dirección de entrega

            DETALLE:
            - Código (si existe)
            - Cantidad
            - Descripción
            - Valor unitario

            TOTALES:
            - Suma total de cantidades
            - Suma total de valores`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Por favor extrae la información de esta Factura de Compra"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const data = await openAIResponse.json()
    console.log('OpenAI response:', data);
    
    const extractedInfo = data.choices[0].message.content

    console.log('Extracted information:', extractedInfo);

    // Update the kanban item with the extracted information
    const { error: updateError } = await supabase
      .from('kanban_items')
      .update({ 
        description: extractedInfo,
      })
      .eq('source_info', pdfUrl)

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
    )
  } catch (error) {
    console.error('Error processing PDF:', error)
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
    )
  }
})