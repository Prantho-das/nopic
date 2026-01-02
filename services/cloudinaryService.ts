// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dsx9qy6rq';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export const uploadToCloudinary = async (base64Data: string): Promise<string> => {
  const formData = new FormData();
  const fileData = base64Data.startsWith('data:') ? base64Data : `data:image/png;base64,${base64Data}`;
  
  formData.append('file', fileData);
  formData.append('upload_preset', UPLOAD_PRESET);

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
    
    // Maintain quality optimization (q_auto) but remove forced f_webp to revert to previous state
    const optimizedUrl = data.secure_url.replace('/upload/', '/upload/q_auto/');
    return optimizedUrl;
  } catch (error) {
    console.error('Cloudinary Service Error:', error);
    throw error;
  }
};