// Storage Service - Image Upload & Management
import { supabase } from './supabaseClient';

const BUCKET_NAME = 'uploads';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes for file type validation
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

async function validateFileContent(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  for (const [mimeType, magic] of Object.entries(MAGIC_BYTES)) {
    if (file.type === mimeType) {
      const matches = magic.every((byte, index) => bytes[index] === byte);
      if (matches) return true;
    }
  }

  // Special check for WebP (RIFF....WEBP)
  if (file.type === 'image/webp') {
    const webpSignature = [0x57, 0x45, 0x42, 0x50]; // WEBP at offset 8
    const hasWebp = webpSignature.every((byte, index) => bytes[index + 8] === byte);
    if (hasWebp) return true;
  }

  return false;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export async function uploadImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    };
  }

  // Validate file content (magic bytes)
  const isValidContent = await validateFileContent(file);
  if (!isValidContent) {
    return {
      success: false,
      error: 'File content does not match its type. Upload rejected.',
    };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)
      ? fileExt
      : 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;
    const filePath = `carousel-images/${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Storage] Upload error:', uploadError);
      return {
        success: false,
        error: 'Failed to upload file.',
      };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('[Storage] Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.',
    };
  }
}

export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      console.error('[Storage] Delete error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Storage] Unexpected delete error:', error);
    return false;
  }
}

export async function listUserImages(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`carousel-images/${userId}`);

    if (error) {
      console.error('[Storage] List error:', error);
      return [];
    }

    return (data || []).map((file) => {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`carousel-images/${userId}/${file.name}`);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error('[Storage] Unexpected list error:', error);
    return [];
  }
}
