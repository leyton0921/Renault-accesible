import Link from "next/link"
import Image from "next/image"

export function SiteHeader() {
  return (
    <header className="border-b border-renault-gray-100 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-center px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-renault.png" alt="Renault" width={36} height={36} priority />
          <span className="text-base font-bold tracking-tight text-renault-black">RENAULT</span>
        </Link>
      </div>
    </header>
  )
}