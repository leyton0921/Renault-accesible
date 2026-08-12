import { DynamicIcon as LucideDynamicIcon } from "lucide-react/dynamic"
import type { LucideProps } from "lucide-react"

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  return <LucideDynamicIcon name={name as any} {...props} />
}