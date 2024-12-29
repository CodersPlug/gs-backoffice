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
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    console.log('Uploading file:', file.name, 'Extension:', fileExt)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    // Get the "Para Hacer" column
    const { data: columns, error: columnsError } = await supabase
      .from('kanban_columns')
      .select('id')
      .eq('title', 'Para Hacer')
      .single()

    if (columnsError) {
      console.error('Columns error:', columnsError)
      throw columnsError
    }

    // Get the lowest order_index in the column
    const { data: items, error: itemsError } = await supabase
      .from('kanban_items')
      .select('order_index')
      .eq('column_id', columns.id)
      .order('order_index', { ascending: true })
      .limit(1)

    if (itemsError) {
      console.error('Items error:', itemsError)
      throw itemsError
    }

    // Set new order_index to be less than the current minimum
    const newOrderIndex = items.length > 0 ? items[0].order_index - 1 : 0

    // Create a new kanban card
    const { data: cardData, error: cardError } = await supabase
      .from('kanban_items')
      .insert({
        column_id: columns.id,
        title: file.name,
        description: `Archivo subido a través del Asistente AI`,
        order_index: newOrderIndex,
        source_info: publicUrl
      })
      .select()
      .single()

    if (cardError) {
      console.error('Card creation error:', cardError)
      throw cardError
    }

    // If it's a PDF, process it to extract invoice information
    if (fileExt === 'pdf') {
      console.log('Processing PDF file:', publicUrl)
      try {
        const processingResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-invoice-pdf`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pdfUrl: publicUrl })
        })

        if (!processingResponse.ok) {
          const errorText = await processingResponse.text()
          console.error('Error processing PDF:', errorText)
          throw new Error(`Error processing PDF: ${errorText}`)
        }

        const processingResult = await processingResponse.json()
        console.log('PDF processing result:', processingResult)
      } catch (processError) {
        console.error('Error calling PDF processor:', processError)
        throw processError
      }
    }

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
    console.error('Error processing upload:', error)
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