import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius)] border bg-clip-padding font-medium whitespace-nowrap outline-none select-none transition-[background,color,border-color,transform,box-shadow] duration-[180ms] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/10 active:not-aria-[haspopup]:scale-[0.97] disabled:cursor-default disabled:pointer-events-none disabled:border-[var(--border-mid)] disabled:bg-[var(--border-mid)] disabled:text-[var(--text-soft)]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] hover:bg-[var(--green-hover)] hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)]",
        outline: "border-[1.5px] border-[var(--border-mid)] bg-transparent text-[var(--text-mid)] hover:border-[var(--text-soft)] hover:text-[var(--text)]",
        secondary: "border-transparent bg-[var(--text)] text-[var(--bg)] hover:bg-primary hover:text-primary-foreground",
        ghost: "border-transparent bg-transparent text-[var(--text-mid)] hover:bg-[var(--bg-alt)] hover:text-[var(--text)]",
        destructive: "border-[1.5px] border-[var(--border-mid)] bg-[var(--bg-alt)] text-[var(--text-mid)] hover:border-[var(--text-soft)] hover:text-[var(--text)]",
        link: "border-transparent bg-transparent px-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 gap-2 px-[26px] py-[13px] text-[15px] leading-none",
        xs: "min-h-8 gap-1.5 px-3 py-2 text-xs leading-none",
        sm: "min-h-9 gap-1.5 px-4 py-2.5 text-sm leading-none",
        lg: "min-h-12 gap-2 px-9 py-[15px] text-base leading-none",
        icon: "size-11",
        "icon-xs": "size-8",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
