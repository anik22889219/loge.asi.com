"use client";

import { useEffect } from "react";

export default function SecureImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'img' || target.closest('.secure-img-container')) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div className={`relative select-none secure-img-container ${className}`} style={{ userSelect: 'none' }}>
      <div className="absolute inset-0 z-10 bg-transparent" title="Image Protected" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="pointer-events-none object-cover w-full h-full"
        draggable={false}
      />
    </div>
  );
}
