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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { pdfUrl } = await req.json()
    
    if (!pdfUrl) {
      throw new Error('No PDF URL provided')
    }

    // Download the PDF content
    const response = await fetch(pdfUrl)
    const pdfBuffer = await response.arrayBuffer()
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)))

    // Use OpenAI to extract information
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting information from purchase invoices (Facturas de Compra). 
            Extract and format the following information in a clear, structured way:

            Header:
            - Fecha
            - Número de orden de compra
            - Proveedor (nombre y CUIT)
            - Cliente (nombre y CUIT)
            - Dirección de entrega

            Body:
            - Código (if any)
            - Cantidad
            - Descripción
            - Valor unitario

            Also calculate and include:
            - Total cantidad
            - Total valor`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please extract the information from this invoice PDF"
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

    const data = await openAIResponse.json()
    const extractedInfo = data.choices[0].message.content

    // Update the kanban item with the extracted information
    const { error: updateError } = await supabase
      .from('kanban_items')
      .update({ 
        description: extractedInfo,
      })
      .eq('source_info', pdfUrl)

    if (updateError) throw updateError

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