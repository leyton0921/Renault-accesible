import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Renault Accesible | Lengua de Señas Colombiana",
  description:
    "Videos en Lengua de Señas Colombiana (LSC) para facilitar la comunicación y atención a clientes sordos o con discapacidad auditiva en Renault Colombia.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
