import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { VideoCard } from "@/components/video-card"
import { DynamicIcon } from "@/components/dynamic-icon"
import { getCategory, getVideosByCategory } from "@/lib/queries"

export const revalidate = 0

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id)
  if (!category) notFound()

  const videos = await getVideosByCategory(category.id)

  return (
    <div className="min-h-dvh bg-renault-gray-50">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <Link
          href="/"
          className="inline-flex touch-target items-center gap-2 text-sm font-medium text-renault-gray-600"
        >
          <ArrowLeft size={18} />
          Volver a categorías
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-renault-gray-100">
            <DynamicIcon name={category.icon} size={28} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-renault-black">{category.name}</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {videos.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-renault-gray-200 p-8 text-center text-renault-gray-600">
              Todavía no hay videos en esta categoría.
            </p>
          ) : (
            videos.map((video) => <VideoCard key={video.id} video={video} />)
          )}
        </div>
      </main>
    </div>
  )
}
