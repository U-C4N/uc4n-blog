import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const STORAGE_BUCKET = 'blog-images';

export async function initializeStorage() {
  try {
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const existingBucket = buckets?.find(bucket => bucket.name === STORAGE_BUCKET);

    if (!existingBucket) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }

    // Update bucket to be public if it exists
    const { error: updateError } = await supabase.storage.updateBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });

    if (updateError) {
      console.error('Error updating bucket:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
}