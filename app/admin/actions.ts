"use server"

import { revalidatePath } from "next/cache"
import { getSupabase } from "@/lib/supabase"

type SupabaseClient = ReturnType<typeof getSupabase>

function str(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

async function uploadToStorage(supabase: SupabaseClient, folder: "videos" | "thumbnails", file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : folder === "videos" ? "mp4" : "jpg"
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  })

  if (error) {
    console.error("[renault-accesible] Error subiendo archivo:", error.message)
    return null
  }

  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl
}

function refreshPublicAndAdmin() {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/categorias")
  revalidatePath("/admin/videos")
}

// Categorías


export async function createCategory(formData: FormData) {
  const name = str(formData, "name")
  if (!name) return

  const supabase = getSupabase()
  const { count } = await supabase.from("categories").select("*", { count: "exact", head: true })

  await supabase.from("categories").insert({
    name,
    icon: str(formData, "icon") || "HelpCircle",
    display_order: count ?? 0,
    status: true,
  })

  refreshPublicAndAdmin()
}

export async function updateCategory(formData: FormData) {
  const id = str(formData, "id")
  const name = str(formData, "name")
  if (!id || !name) return

  const supabase = getSupabase()
  await supabase
    .from("categories")
    .update({
      name,
      icon: str(formData, "icon") || "HelpCircle",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  refreshPublicAndAdmin()
}

export async function toggleCategoryStatus(formData: FormData) {
  const id = str(formData, "id")
  const currentlyActive = str(formData, "current") === "true"
  if (!id) return

  const supabase = getSupabase()
  await supabase.from("categories").update({ status: !currentlyActive }).eq("id", id)

  refreshPublicAndAdmin()
}

export async function deleteCategory(formData: FormData) {
  const id = str(formData, "id")
  if (!id) return

  const supabase = getSupabase()
  // Los videos de esta categoría quedan sin categoría.
  await supabase.from("videos").update({ category_id: null }).eq("category_id", id)
  await supabase.from("categories").delete().eq("id", id)

  refreshPublicAndAdmin()
}

export async function moveCategory(formData: FormData) {
  const id = str(formData, "id")
  const direction = str(formData, "direction")
  if (!id) return

  const supabase = getSupabase()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, display_order")
    .order("display_order", { ascending: true })

  if (!categories) return

  const index = categories.findIndex((c) => c.id === id)
  const swapIndex = direction === "up" ? index - 1 : index + 1
  if (index === -1 || swapIndex < 0 || swapIndex >= categories.length) return

  const a = categories[index]
  const b = categories[swapIndex]

  await Promise.all([
    supabase.from("categories").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("categories").update({ display_order: a.display_order }).eq("id", b.id),
  ])

  refreshPublicAndAdmin()
}

// Videos

export async function createVideo(formData: FormData) {
  const title = str(formData, "title")
  const categoryId = str(formData, "category_id")
  if (!title || !categoryId) return

  const supabase = getSupabase()

  const videoFile = formData.get("video_file") as File | null
  const thumbnailFile = formData.get("thumbnail_file") as File | null

  const video_url = videoFile && videoFile.size > 0 ? await uploadToStorage(supabase, "videos", videoFile) : null
  const thumbnail_url =
    thumbnailFile && thumbnailFile.size > 0 ? await uploadToStorage(supabase, "thumbnails", thumbnailFile) : null

  const { count } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId)

  await supabase.from("videos").insert({
    category_id: categoryId,
    title,
    video_url,
    thumbnail_url,
    display_order: count ?? 0,
    status: true,
  })

  refreshPublicAndAdmin()
}

export async function updateVideo(formData: FormData) {
  const id = str(formData, "id")
  const title = str(formData, "title")
  if (!id || !title) return

  const supabase = getSupabase()

  const videoFile = formData.get("video_file") as File | null
  const thumbnailFile = formData.get("thumbnail_file") as File | null

  const update: Record<string, unknown> = {
    title,
    category_id: str(formData, "category_id") || null,
    updated_at: new Date().toISOString(),
  }

  if (videoFile && videoFile.size > 0) {
    update.video_url = await uploadToStorage(supabase, "videos", videoFile)
  }
  if (thumbnailFile && thumbnailFile.size > 0) {
    update.thumbnail_url = await uploadToStorage(supabase, "thumbnails", thumbnailFile)
  }

  await supabase.from("videos").update(update).eq("id", id)

  refreshPublicAndAdmin()
}

export async function toggleVideoStatus(formData: FormData) {
  const id = str(formData, "id")
  const currentlyActive = str(formData, "current") === "true"
  if (!id) return

  const supabase = getSupabase()
  await supabase.from("videos").update({ status: !currentlyActive }).eq("id", id)

  refreshPublicAndAdmin()
}

export async function deleteVideo(formData: FormData) {
  const id = str(formData, "id")
  if (!id) return

  const supabase = getSupabase()
  await supabase.from("videos").delete().eq("id", id)

  refreshPublicAndAdmin()
}

export async function moveVideo(formData: FormData) {
  const id = str(formData, "id")
  const direction = str(formData, "direction")
  const categoryId = str(formData, "category_id")
  if (!id) return

  const supabase = getSupabase()
  const { data: videos } = await supabase
    .from("videos")
    .select("id, display_order")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true })

  if (!videos) return

  const index = videos.findIndex((v) => v.id === id)
  const swapIndex = direction === "up" ? index - 1 : index + 1
  if (index === -1 || swapIndex < 0 || swapIndex >= videos.length) return

  const a = videos[index]
  const b = videos[swapIndex]

  await Promise.all([
    supabase.from("videos").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("videos").update({ display_order: a.display_order }).eq("id", b.id),
  ])

  refreshPublicAndAdmin()
}
