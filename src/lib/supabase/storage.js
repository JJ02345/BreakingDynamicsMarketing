import { supabase } from './client';
import { auth } from './auth';

export const storage = {
  async uploadImage(file, folder = 'carousel-images') {
    const user = await auth.getUser();
    const userId = user?.id || 'anonymous';

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error('Bild-Upload fehlgeschlagen: ' + error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
    };
  },

  async deleteImage(filePath) {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error('Bild-Löschung fehlgeschlagen');
    }
  },

  async getUserImages(folder = 'carousel-images') {
    const user = await auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase.storage
      .from('uploads')
      .list(`${folder}/${user.id}`, {
        limit: 50,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('List images error:', error);
      return [];
    }

    return (data || []).map(file => {
      const filePath = `${folder}/${user.id}/${file.name}`;
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return {
        name: file.name,
        path: filePath,
        url: publicUrl,
        createdAt: file.created_at,
        size: file.metadata?.size,
      };
    });
  },
};

export default storage;
