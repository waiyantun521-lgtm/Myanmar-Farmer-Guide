import { useState } from "react";
import { Sprout } from "lucide-react";

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitleMm: string;
}

export function ResilientImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackTitleMm,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EEF2EA] to-[#E3E9DC] text-[#15623E] p-6 text-center"
      >
        <Sprout className="w-8 h-8 opacity-80" aria-hidden="true" />
        <p className="text-sm font-medium text-[#243B2E]">{fallbackTitleMm}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
