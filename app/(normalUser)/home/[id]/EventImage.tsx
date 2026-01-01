"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

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
  priority = true,
}: EventImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center p-8">
          <svg
            className="h-16 w-16 mx-auto text-purple-400 mb-4 opacity-30"
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
          <p className="text-sm font-black uppercase tracking-widest text-purple-400/50">
            Event Cover Unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative h-full w-full group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsFullScreen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${className}`}
          onError={() => setImageError(true)}
        />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] transition-all"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovered ? 1 : 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 hover:bg-white/30 transition-colors shadow-lg">
              <Maximize2 className="w-8 h-8" />
            </div>
            <span className="text-white font-black text-xs uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
              View Full Size
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Full Screen Lightbox */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setIsFullScreen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 z-50"
              onClick={() => setIsFullScreen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="95vw"
                quality={90}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
