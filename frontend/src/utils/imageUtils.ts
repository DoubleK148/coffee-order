export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/default-image.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${process.env.REACT_APP_API_URL}${imagePath}`;
}; 