import { icons, HelpCircle, type LucideProps } from "lucide-react"

/**
 * Renderiza un ícono de Lucide a partir de su nombre guardado en la
 * base de datos (ej. "Hand", "Car", "Wrench"). Si el nombre no existe
 * o el campo está vacío, muestra un ícono de respaldo para que la
 * interfaz nunca se rompa por un dato mal escrito.
 *
 * Lista completa de nombres válidos: https://lucide.dev/icons
 */
export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? HelpCircle
  return <Icon {...props} />
}
