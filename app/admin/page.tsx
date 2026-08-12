import Link from "next/link"
import { FolderKanban, Video as VideoIcon, CheckCircle2, EyeOff } from "lucide-react"
import { adminGetStats, adminGetVideos } from "@/lib/admin-queries"

export const revalidate = 0

export default async function AdminDashboardPage() {
  const stats = await adminGetStats()
  const videos = await adminGetVideos()
  const recentVideos = videos.slice(-5).reverse()

  const cards = [
    { label: "Categorías", value: stats.categoryCount, icon: FolderKanban },
    { label: "Videos totales", value: stats.videoCount, icon: VideoIcon },
    { label: "Videos publicados", value: stats.activeVideos, icon: CheckCircle2 },
    { label: "Videos deshabilitados", value: stats.disabledVideos, icon: EyeOff },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-renault-black">Resumen</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-renault-gray-100 bg-white p-5 shadow-card">
            <card.icon size={20} className="text-renault-gray-600" />
            <p className="mt-3 text-2xl font-bold text-renault-black">{card.value}</p>
            <p className="text-sm text-renault-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-renault-gray-600">Videos añadidos recientemente</h2>
        <div className="mt-3 divide-y divide-renault-gray-100 rounded-2xl border border-renault-gray-100 bg-white shadow-card">
          {recentVideos.length === 0 ? (
            <p className="p-5 text-sm text-renault-gray-600">Aún no se han subido videos.</p>
          ) : (
            recentVideos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-renault-black">{video.title}</p>
                  <p className="text-xs text-renault-gray-600">{video.category_name ?? "Sin categoría"}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    video.status ? "bg-green-50 text-green-700" : "bg-renault-gray-100 text-renault-gray-600"
                  }`}
                >
                  {video.status ? "Publicado" : "Deshabilitado"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/categorias"
          className="rounded-xl bg-renault-black px-4 py-2.5 text-sm font-medium text-white"
        >
          Gestionar categorías
        </Link>
        <Link
          href="/admin/videos"
          className="rounded-xl border border-renault-gray-200 px-4 py-2.5 text-sm font-medium text-renault-black"
        >
          Gestionar videos
        </Link>
      </div>
    </div>
  )
}
