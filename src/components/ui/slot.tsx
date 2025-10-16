import * as React from "react"
import * as SlotPrimitive from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const Slot = React.forwardRef<
  React.ElementRef<typeof SlotPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SlotPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SlotPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Slot.displayName = SlotPrimitive.Root.displayName

export { Slot }