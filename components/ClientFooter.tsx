"use client"

import { SimpleFooter } from "./SimpleFooter"

export function ClientFooter() {
  return (
    <div className="w-full bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] mt-auto">
      <div className="w-full">
        <SimpleFooter />
      </div>
    </div>
  )
}
