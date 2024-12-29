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
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload file to storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    let imageUrl = null

    // If the file is a PDF, generate a snapshot
    if (fileExt.toLowerCase() === 'pdf') {
      try {
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-pdf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
          body: JSON.stringify({ pdfUrl: publicUrl }),
        })

        if (!response.ok) throw new Error('Failed to process PDF')
        
        const { snapshotUrl } = await response.json()
        imageUrl = snapshotUrl
      } catch (error) {
        console.error('Error processing PDF:', error)
        // Continue without thumbnail if PDF processing fails
      }
    }

    // Get the "Para Hacer" column
    const { data: columns, error: columnsError } = await supabase
      .from('kanban_columns')
      .select('id')
      .eq('title', 'Para Hacer')
      .single()

    if (columnsError) throw columnsError

    // Get the lowest order_index in the column
    const { data: items, error: itemsError } = await supabase
      .from('kanban_items')
      .select('order_index')
      .eq('column_id', columns.id)
      .order('order_index', { ascending: true })
      .limit(1)

    if (itemsError) throw itemsError

    // Set new order_index to be less than the current minimum
    const newOrderIndex = items.length > 0 ? items[0].order_index - 1 : 0

    // Create a new kanban card
    const { data: cardData, error: cardError } = await supabase
      .from('kanban_items')
      .insert({
        column_id: columns.id,
        title: file.name,
        description: `Archivo subido a través del Asistente AI`,
        content: `[Ver archivo](${publicUrl})`,
        order_index: newOrderIndex,
        source_info: publicUrl,
        image: imageUrl // Store the snapshot URL in the image field
      })
      .select()
      .single()

    if (cardError) throw cardError

    return new Response(
      JSON.stringify({ 
        message: 'Archivo subido y tarjeta creada exitosamente',
        card: cardData 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar el archivo', 
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