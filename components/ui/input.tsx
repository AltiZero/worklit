import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-[var(--radius)] border-[1.5px] border-[var(--border-mid)] bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-foreground outline-none transition-[border-color,box-shadow] duration-[180ms] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--text-soft)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/10 disabled:pointer-events-none disabled:cursor-default disabled:bg-[var(--bg-alt)] disabled:text-[var(--text-soft)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
