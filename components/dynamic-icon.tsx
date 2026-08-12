import { icons, HelpCircle, type LucideProps } from "lucide-react"

function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("") as keyof typeof icons
}

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[toPascalCase(name)] ?? HelpCircle
  return <Icon {...props} />
}