import { SiteHeader } from "@/components/site-header"
import { CategoryCard } from "@/components/category-card"
import { getActiveCategories } from "@/lib/queries"
export const revalidate = 0

export default async function HomePage() {
  const categories = await getActiveCategories()

  return (
    <div className="min-h-dvh bg-renault-gray-50">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-renault-black sm:text-4xl">
            Renault Accesible
          </h1>
          <p className="mt-2 text-lg font-medium text-renault-gray-600">
            Escuchamos más allá de las palabras
          </p>

        </div>

        <div className="mt-10 grid gap-4">
          {categories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-renault-gray-200 p-8 text-center text-renault-gray-600">
              Todavía no hay categorías publicadas.
            </p>
          ) : (
            categories.map((category) => <CategoryCard key={category.id} category={category} />)
          )}
        </div>
      </main>
    </div>
  )
}
