import { ArrowUp, ArrowDown, Trash2, Play } from "lucide-react"
import { adminGetCategories } from "@/lib/admin-queries"
import { adminGetVideos } from "@/lib/admin-queries"
import { createVideo, updateVideo, toggleVideoStatus, deleteVideo, moveVideo } from "@/app/admin/actions"

export const revalidate = 0

export default async function AdminVideosPage() {
  const [categories, videos] = await Promise.all([adminGetCategories(), adminGetVideos()])

  // Agrupar videos por categoría para calcular posición
  const videosByCategory = new Map<string, typeof videos>()
  for (const video of videos) {
    const key = video.category_id ?? "sin-categoria"
    videosByCategory.set(key, [...(videosByCategory.get(key) ?? []), video])
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-renault-black">Videos</h1>
      <p className="mt-1 text-sm text-renault-gray-600">Formato de video soportado: MP4.</p>

      {/* Subir video nuevo */}
      <form
        action={createVideo}
        encType="multipart/form-data"
        className="mt-6 grid gap-3 rounded-2xl border border-renault-gray-100 bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <input
          name="title"
          placeholder="Título del video"
          required
          className="touch-target rounded-lg border border-renault-gray-200 px-3 sm:col-span-2"
        />
        <select
          name="category_id"
          required
          defaultValue=""
          className="touch-target rounded-lg border border-renault-gray-200 px-3"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <label className="block text-sm">
          <span className="mb-1 block text-renault-gray-600">Archivo de video (MP4)</span>
          <input name="video_file" type="file" accept="video/mp4" required className="w-full text-sm" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-renault-gray-600">Miniatura (opcional)</span>
          <input name="thumbnail_file" type="file" accept="image/*" className="w-full text-sm" />
        </label>
        <button
          type="submit"
          className="touch-target rounded-lg bg-renault-black px-4 text-sm font-medium text-white sm:col-span-2"
        >
          Subir video
        </button>
      </form>

      {/* Lista de videos */}
      <div className="mt-6 space-y-3">
        {videos.length === 0 && (
          <p className="rounded-2xl border border-dashed border-renault-gray-200 p-8 text-center text-renault-gray-600">
            Aún no hay videos. Sube el primero arriba.
          </p>
        )}

        {videos.map((video) => {
          const siblings = videosByCategory.get(video.category_id ?? "sin-categoria") ?? []
          const index = siblings.findIndex((v) => v.id === video.id)

          return (
            <div
              key={video.id}
              className="grid gap-3 rounded-2xl border border-renault-gray-100 bg-white p-4 shadow-card sm:grid-cols-[auto_1fr_auto] sm:items-start"
            >
              <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-renault-gray-800">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Play size={20} className="text-white/70" />
                )}
              </div>

              <form
                action={updateVideo}
                encType="multipart/form-data"
                className="grid gap-2 sm:grid-cols-2"
              >
                <input type="hidden" name="id" value={video.id} />
                <input
                  name="title"
                  defaultValue={video.title}
                  required
                  className="touch-target rounded-lg border border-renault-gray-200 px-3 text-sm sm:col-span-2"
                />
                <select
                  name="category_id"
                  defaultValue={video.category_id ?? ""}
                  className="touch-target rounded-lg border border-renault-gray-200 px-3 text-sm"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <label className="block text-xs text-renault-gray-600">
                  Reemplazar video
                  <input name="video_file" type="file" accept="video/mp4" className="mt-1 w-full text-xs" />
                </label>
                <label className="block text-xs text-renault-gray-600">
                  Reemplazar miniatura
                  <input name="thumbnail_file" type="file" accept="image/*" className="mt-1 w-full text-xs" />
                </label>
                <button
                  type="submit"
                  className="touch-target rounded-lg border border-renault-gray-200 px-4 text-sm font-medium sm:col-span-2"
                >
                  Guardar cambios
                </button>
              </form>

              <div className="flex items-center gap-1.5 sm:flex-col sm:items-stretch">
                <div className="flex gap-1.5">
                  <form action={moveVideo}>
                    <input type="hidden" name="id" value={video.id} />
                    <input type="hidden" name="category_id" value={video.category_id ?? ""} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index <= 0}
                      aria-label="Subir"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-renault-gray-200 disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                  </form>
                  <form action={moveVideo}>
                    <input type="hidden" name="id" value={video.id} />
                    <input type="hidden" name="category_id" value={video.category_id ?? ""} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === -1 || index >= siblings.length - 1}
                      aria-label="Bajar"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-renault-gray-200 disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </form>
                </div>
                <form action={toggleVideoStatus}>
                  <input type="hidden" name="id" value={video.id} />
                  <input type="hidden" name="current" value={String(video.status)} />
                  <button
                    type="submit"
                    className={`h-9 w-full rounded-lg px-3 text-xs font-medium ${
                      video.status ? "bg-green-50 text-green-700" : "bg-renault-gray-100 text-renault-gray-600"
                    }`}
                  >
                    {video.status ? "Publicado" : "Oculto"}
                  </button>
                </form>
                <form action={deleteVideo}>
                  <input type="hidden" name="id" value={video.id} />
                  <button
                    type="submit"
                    aria-label="Eliminar video"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-renault-gray-200 text-red-600 sm:w-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
