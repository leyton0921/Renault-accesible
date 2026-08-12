import Link from "next/link"
import { DynamicIcon } from "@/components/dynamic-icon"
import type { CategoryWithCount } from "@/lib/types"

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  return (
    <Link
      href={`/categoria/${category.id}`}
      className="group flex touch-target items-center gap-4 rounded-2xl border border-renault-gray-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-renault-gray-50 text-renault-black transition group-hover:bg-renault-yellow/20">
        <DynamicIcon name={category.icon} size={28} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold text-renault-black">{category.name}</h2>
      </div>
      <span className="shrink-0 rounded-full bg-renault-gray-50 px-2.5 py-1 text-xs font-medium text-renault-gray-600">
        {category.video_count}
      </span>
    </Link>
  )
}
