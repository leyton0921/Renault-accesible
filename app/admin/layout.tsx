import Link from "next/link"
import { LayoutDashboard, FolderKanban, Video as VideoIcon, ExternalLink } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/categorias", label: "Categorías", icon: FolderKanban },
  { href: "/admin/videos", label: "Videos", icon: VideoIcon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-renault-gray-50">
      <header className="border-b border-renault-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-bold tracking-tight">RENAULT · Administración</p>
            <p className="text-xs text-renault-gray-600">Renault Accesible</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-renault-gray-600 hover:text-renault-black"
          >
            Ver sitio público <ExternalLink size={14} />
          </a>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-renault-gray-600 hover:border-renault-black hover:text-renault-black"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
