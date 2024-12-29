import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Document } from "https://cdn.skypack.dev/pdf-lib?dts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { pdfUrl } = await req.json()
    
    if (!pdfUrl) {
      throw new Error('No PDF URL provided')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the PDF file
    const pdfResponse = await fetch(pdfUrl)
    const pdfArrayBuffer = await pdfResponse.arrayBuffer()
    
    // Load the PDF document
    const pdfDoc = await Document.load(pdfArrayBuffer)
    const pages = pdfDoc.getPages()
    
    if (pages.length === 0) {
      throw new Error('PDF has no pages')
    }

    // Get the first page
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    // Create a snapshot of the first page
    const snapshotBytes = await firstPage.renderToImage({
      width,
      height,
      format: 'png',
    })

    // Upload the snapshot to storage
    const snapshotPath = `${crypto.randomUUID()}.png`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(snapshotPath, snapshotBytes, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get the public URL of the uploaded snapshot
    const { data: { publicUrl: snapshotUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(snapshotPath)

    return new Response(
      JSON.stringify({ snapshotUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})