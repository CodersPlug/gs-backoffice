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
    const providerName = formData.get('providerName')
    const effectiveDate = formData.get('effectiveDate')

    if (!file || !providerName || !effectiveDate) {
      throw new Error('Missing required fields')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload file to storage
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const filePath = `price-lists/${crypto.randomUUID()}.${fileExt}`

    console.log('Uploading price list:', {
      fileName: file.name,
      providerName,
      effectiveDate,
      filePath
    })

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

    // Get the "Lista de Precios" column
    const { data: columns, error: columnsError } = await supabase
      .from('kanban_columns')
      .select('id')
      .eq('title', 'Lista de Precios')
      .single()

    if (columnsError) {
      console.error('Columns error:', columnsError)
      throw columnsError
    }

    // Create price list record
    const { data: priceList, error: priceListError } = await supabase
      .from('price_lists')
      .insert({
        provider_name: providerName,
        file_path: filePath,
        filename: file.name,
        effective_date: effectiveDate,
        content_type: file.type,
        size: file.size
      })
      .select()
      .single()

    if (priceListError) {
      console.error('Price list creation error:', priceListError)
      throw priceListError
    }

    // Create kanban card for the price list
    const { data: cardData, error: cardError } = await supabase
      .from('kanban_items')
      .insert({
        column_id: columns.id,
        title: `Lista de Precios - ${providerName}`,
        description: `Lista de precios vigente desde ${new Date(effectiveDate).toLocaleDateString()}`,
        order_index: 0,
        source_info: publicUrl,
        content: JSON.stringify({
          priceListId: priceList.id,
          effectiveDate,
          fileType: 'PDF'
        }),
        attachments: JSON.stringify([{
          url: publicUrl,
          name: file.name
        }])
      })
      .select()
      .single()

    if (cardError) {
      console.error('Card creation error:', cardError)
      throw cardError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Lista de precios subida exitosamente',
        card: cardData,
        priceList 
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