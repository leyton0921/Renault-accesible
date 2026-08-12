import { getSupabase } from "@/lib/supabase"
import type { Category, CategoryWithCount, Video } from "@/lib/types"

export async function getActiveCategories(): Promise<CategoryWithCount[]> {
  const supabase = getSupabase()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("status", true)
    .order("display_order", { ascending: true })

  if (!categories) return []

  const { data: videos } = await supabase.from("videos").select("category_id").eq("status", true)

  const counts = new Map<string, number>()
  for (const v of videos ?? []) {
    if (v.category_id) counts.set(v.category_id, (counts.get(v.category_id) ?? 0) + 1)
  }

  return (categories as Category[]).map((c) => ({
    ...c,
    video_count: counts.get(c.id) ?? 0,
  }))
}

export async function getCategory(id: string): Promise<Category | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from("categories").select("*").eq("id", id).eq("status", true).single()
  return (data as Category) ?? null
}

export async function getVideosByCategory(categoryId: string): Promise<Video[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", true)
    .order("display_order", { ascending: true })
  return (data as Video[]) ?? []
}

export async function getVideo(id: string): Promise<Video | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from("videos").select("*").eq("id", id).eq("status", true).single()
  return (data as Video) ?? null
}
