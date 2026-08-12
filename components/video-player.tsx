"use client"

import Link from "next/link"
import { X } from "lucide-react"

export function VideoPlayer({
  src,
  poster,
  title,
  backHref,
}: {
  src: string
  poster: string | null
  title: string
  backHref: string
}) {
  return (
    <div className="relative">
      <Link
        href={backHref}
        aria-label="Cerrar video"
        className="absolute -top-3 right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-renault-black text-white shadow-md sm:-right-3"
      >
        <X size={20} />
      </Link>
      <video
        className="w-full rounded-2xl bg-black shadow-card"
        src={src}
        poster={poster ?? undefined}
        controls
        playsInline
        preload="metadata"
        aria-label={title}
      >
        Tu navegador no soporta la reproducción de este video.
      </video>
    </div>
  )
}
