export const validateImageFile = (file, maxSizeMB = 5) => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `La imagen no debe superar los ${maxSizeMB}MB`;
  }
  if (!file.type.startsWith('image/')) {
    return "Solo se permiten archivos de imagen";
  }
  return null;
};
