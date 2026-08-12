import { DynamicIcon as LucideDynamicIcon, type LucideProps } from "lucide-react/dynamic"

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  return <LucideDynamicIcon name={name as any} {...props} />
}