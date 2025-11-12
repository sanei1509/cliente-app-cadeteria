const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvu1wtvuq/image/upload";
const CLOUDINARY_PRESET = "Cadeteria";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("file", file);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir imagen a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url || data.url;
};
