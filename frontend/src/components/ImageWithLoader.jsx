import { useState } from "react";

const ImageWithLoader = ({ src, alt, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
    >
      {/* SKELETON */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-lg" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy" 
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ImageWithLoader;
