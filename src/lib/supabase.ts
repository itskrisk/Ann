import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

// ── Storage helpers ──────────────────────────────────────────

const BUCKET = 'vault'
const SIGNED_URL_TTL = 60 * 60 * 6 // 6 hours

/** Upload a file to the private vault bucket under userId/timestamp_filename */
export async function uploadVaultFile(
  userId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ storagePath: string; signedUrl: string } | null> {
  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const storagePath = `${userId}/${safeName}`

  onProgress?.(20)

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: false, contentType: file.type })

  if (uploadError) {
    console.error('[vault storage] upload error:', uploadError.message)
    return null
  }

  onProgress?.(80)

  const { data: signedData, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL)

  if (signedError || !signedData) {
    console.error('[vault storage] signed URL error:', signedError?.message)
    return null
  }

  onProgress?.(100)

  return { storagePath, signedUrl: signedData.signedUrl }
}

/** Generate a fresh signed URL for an existing storage path */
export async function getSignedUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL)

  if (error || !data) return null
  return data.signedUrl
}


/** Delete a file from storage */
export async function deleteVaultFile(storagePath: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([storagePath])
}
