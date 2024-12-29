import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as pdfjsLib from 'https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.min.js'

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

    console.log('Processing PDF from URL:', pdfUrl)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the PDF file
    const pdfResponse = await fetch(pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF')
    }
    
    const pdfArrayBuffer = await pdfResponse.arrayBuffer()
    
    // Load the PDF document using pdf.js
    const loadingTask = pdfjsLib.getDocument({ data: pdfArrayBuffer })
    const pdfDoc = await loadingTask.promise
    
    if (pdfDoc.numPages === 0) {
      throw new Error('PDF has no pages')
    }

    // Get the first page
    const page = await pdfDoc.getPage(1)
    const viewport = page.getViewport({ scale: 1.0 })

    // Create a canvas to render the page
    const canvas = new OffscreenCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Failed to get canvas context')
    }

    // Render the page to the canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise

    // Convert the canvas to a PNG blob
    const imageBlob = await canvas.convertToBlob({ type: 'image/png' })
    const imageArrayBuffer = await imageBlob.arrayBuffer()

    // Upload the snapshot to storage
    const snapshotPath = `${crypto.randomUUID()}.png`
    console.log('Uploading snapshot to path:', snapshotPath)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(snapshotPath, imageArrayBuffer, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get the public URL of the uploaded snapshot
    const { data: { publicUrl: snapshotUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(snapshotPath)

    console.log('Generated snapshot URL:', snapshotUrl)

    return new Response(
      JSON.stringify({ snapshotUrl }),
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
      JSON.stringify({ error: error.message }),
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