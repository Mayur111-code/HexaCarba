import { useState } from 'react';

/**
 * Image with fallback placeholder when the asset file is missing.
 * Drop your real image at `src` (see src/data/images.js) to replace demos.
 */
const ContentImage = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  aspectRatio,
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-center p-4 ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs text-gray-500 font-medium">{fallbackLabel || alt}</p>
        {src && <p className="text-[10px] text-gray-600 mt-1 max-w-full truncate px-2">{src}</p>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ContentImage;
