"use client";

import Image from "next/image";
import { useState } from "react";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function EventImage({
  src,
  alt,
  className = "",
  priority = false,
}: EventImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center p-6">
          <svg
            className="h-12 w-12 mx-auto text-purple-400 mb-2 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-400/50">
            No Image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${className}`}
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
