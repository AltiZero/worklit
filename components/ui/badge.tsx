import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap transition-[background,color,border-color] duration-[180ms] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/10 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[var(--green-mid)] bg-[var(--green-light)] text-[var(--green-dark)]",
        secondary: "border-[var(--border-mid)] bg-[var(--bg-alt)] text-[var(--text-mid)]",
        destructive: "border-[var(--border-mid)] bg-[var(--bg-alt)] text-[var(--text-soft)]",
        outline: "border-border bg-card text-foreground",
        ghost: "border-transparent bg-transparent text-[var(--text-mid)] hover:bg-[var(--bg-alt)]",
        link: "border-transparent bg-transparent px-0 text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
