import { ArrowUp, ArrowDown, Trash2 } from "lucide-react"
import { DynamicIcon } from "@/components/dynamic-icon"
import { adminGetCategories } from "@/lib/admin-queries"
import {
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  moveCategory,
} from "@/app/admin/actions"

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories()

  return (
    <div>
      <h1 className="text-xl font-bold text-renault-black">Categorías</h1>


      {/* Crear categoría */}
      <form
        action={createCategory}
        className="mt-6 grid gap-3 rounded-2xl border border-renault-gray-100 bg-white p-5 shadow-card sm:grid-cols-4"
      >
        <input
          name="name"
          placeholder="Nombre (ej. Saludos)"
          required
          className="touch-target rounded-lg border border-renault-gray-200 px-3 sm:col-span-1"
        />
        <input
          name="icon"
          placeholder="Ícono (ej. Hand)"
          className="touch-target rounded-lg border border-renault-gray-200 px-3"
        />
        <button
          type="submit"
          className="touch-target rounded-lg bg-renault-black px-4 text-sm font-medium text-white sm:col-span-4"
        >
          Añadir categoría
        </button>
      </form>

      {/* Lista de categorías */}
      <div className="mt-6 space-y-3">
        {categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-renault-gray-200 p-8 text-center text-renault-gray-600">
            Aún no hay categorías. Crea la primera arriba.
          </p>
        )}

        {categories.map((category, index) => (
          <div
            key={category.id}
            className="grid gap-3 rounded-2xl border border-renault-gray-100 bg-white p-4 shadow-card sm:grid-cols-[auto_1fr_auto] sm:items-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-renault-gray-50">
              <DynamicIcon name={category.icon} size={20} />
            </div>

            <form action={updateCategory} className="grid gap-2 sm:grid-cols-3">
              <input type="hidden" name="id" value={category.id} />
              <input
                name="name"
                defaultValue={category.name}
                required
                className="touch-target rounded-lg border border-renault-gray-200 px-3 text-sm"
              />
              <div className="flex gap-2">
                <input
                  name="icon"
                  defaultValue={category.icon}
                  className="touch-target w-full rounded-lg border border-renault-gray-200 px-3 text-sm"
                />
                <button
                  type="submit"
                  className="touch-target shrink-0 rounded-lg border border-renault-gray-200 px-3 text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </form>

            <div className="flex items-center gap-1.5 sm:justify-end">
              <form action={moveCategory}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  aria-label="Subir"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-renault-gray-200 disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
              </form>
              <form action={moveCategory}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === categories.length - 1}
                  aria-label="Bajar"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-renault-gray-200 disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
              </form>
              <form action={toggleCategoryStatus}>
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="current" value={String(category.status)} />
                <button
                  type="submit"
                  className={`h-9 rounded-lg px-3 text-xs font-medium ${
                    category.status
                      ? "bg-green-50 text-green-700"
                      : "bg-renault-gray-100 text-renault-gray-600"
                  }`}
                >
                  {category.status ? "Activa" : "Oculta"}
                </button>
              </form>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button
                  type="submit"
                  aria-label="Eliminar categoría"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-renault-gray-200 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
