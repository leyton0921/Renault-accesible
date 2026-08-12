import Link from "next/link"
import { Play } from "lucide-react"
import type { Video } from "@/lib/types"

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group block overflow-hidden rounded-2xl border border-renault-gray-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="relative aspect-video w-full bg-renault-gray-800">
        {video.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-renault-black shadow-md">
            <Play size={24} fill="currentColor" className="translate-x-0.5" />
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-renault-black">{video.title}</h3>
      </div>
    </Link>
  )
}
