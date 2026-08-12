import { getSupabase } from "@/lib/supabase"
import type { Category, VideoWithCategory } from "@/lib/types"

export async function adminGetCategories(): Promise<Category[]> {
  const supabase = getSupabase()
  const { data } = await supabase.from("categories").select("*").order("display_order", { ascending: true })
  return (data as Category[]) ?? []
}

export async function adminGetVideos(): Promise<VideoWithCategory[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from("videos")
    .select("*, categories(name)")
    .order("display_order", { ascending: true })

  return ((data ?? []) as any[]).map((v) => ({
    ...v,
    category_name: v.categories?.name ?? null,
  })) as VideoWithCategory[]
}

export async function adminGetStats() {
  const supabase = getSupabase()
  const [{ count: categoryCount }, { count: videoCount }, { count: activeVideos }] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("videos").select("*", { count: "exact", head: true }),
    supabase.from("videos").select("*", { count: "exact", head: true }).eq("status", true),
  ])

  return {
    categoryCount: categoryCount ?? 0,
    videoCount: videoCount ?? 0,
    activeVideos: activeVideos ?? 0,
    disabledVideos: (videoCount ?? 0) - (activeVideos ?? 0),
  }
}
