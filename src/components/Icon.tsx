import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof Icons;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = Icons[name as IconName] as React.ComponentType<LucideProps> | undefined;
  if (!Component) return null;
  return <Component {...props} />;
}
