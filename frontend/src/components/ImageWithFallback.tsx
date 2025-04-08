import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { getImageUrl } from '../utils/imageUtils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width = 200,
  height = 200
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <img
        src={error ? '/default-image.jpg' : getImageUrl(src)}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loading ? 'none' : 'block'
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error(`Failed to load image: ${src}`);
          setError(true);
          setLoading(false);
        }}
      />
    </Box>
  );
}; 