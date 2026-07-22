"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface PhotoModalProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export function PhotoModal({ src, alt, open, onClose }: PhotoModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-slate-300"
          aria-label="닫기"
        >
          ✕ 닫기
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn("max-h-[85vh] w-auto rounded-lg object-contain")}
        />
      </div>
    </div>
  );
}
