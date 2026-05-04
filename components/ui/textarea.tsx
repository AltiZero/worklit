import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-[var(--radius)] border-[1.5px] border-[var(--border-mid)] bg-card px-4 py-[13px] text-[15px] leading-[1.6] text-foreground outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[var(--text-soft)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/10 disabled:cursor-default disabled:bg-[var(--bg-alt)] disabled:text-[var(--text-soft)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
