
// Cloudinary configuration
// Note: Frontend uploads typically use the Cloud Name and an Unsigned Upload Preset.
// API Key and Secret are usually for server-side usage, but we'll store them as fallbacks if needed.
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dsx9qy6rq'; // Fallback cloud name or placeholder
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export const uploadToCloudinary = async (base64Data: string): Promise<string> => {
  const formData = new FormData();
  // Ensure the base64 string has the correct prefix for Cloudinary if not already present
  const fileData = base64Data.startsWith('data:') ? base64Data : `data:image/png;base64,${base64Data}`;
  
  formData.append('file', fileData);
  formData.append('upload_preset', UPLOAD_PRESET);
  
  // Optional: If using the provided API Key for some reason (though not standard for unsigned)
  // formData.append('api_key', '548119319726167');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Service Error:', error);
    throw error;
  }
};
