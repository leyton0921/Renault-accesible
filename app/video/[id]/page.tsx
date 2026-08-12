import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { VideoPlayer } from "@/components/video-player"
import { getVideo } from "@/lib/queries"

export const revalidate = 0

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id)
  if (!video || !video.video_url) notFound()

  return (
    <div className="min-h-dvh bg-renault-gray-50">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-6 pb-16 pt-8">
        <VideoPlayer
          src={video.video_url}
          poster={video.thumbnail_url}
          title={video.title}
          backHref={video.category_id ? `/categoria/${video.category_id}` : "/"}
        />

        <div className="mt-6">
          <h1 className="text-xl font-bold text-renault-black">{video.title}</h1>
          {video.description && <p className="mt-2 text-renault-gray-600">{video.description}</p>}
        </div>
      </main>
    </div>
  )
}
