export type Category = {
  id: string
  name: string
  icon: string
  display_order: number
  status: boolean
  created_at: string
  updated_at: string
  descripcion?: string
}

export type Video = {
  id: string
  category_id: string | null
  title: string
  video_url: string | null
  thumbnail_url: string | null
  display_order: number
  status: boolean
  created_at: string
  updated_at: string
}

export type CategoryWithCount = Category & { video_count: number }
export type VideoWithCategory = Video & { category_name: string | null }
