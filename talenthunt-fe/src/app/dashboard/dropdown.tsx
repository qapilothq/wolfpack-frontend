"use client"
import React from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const jobtitle = [
    {
      label: "Solution Architect",
      value: "SA",
    },
    {
      label: "Software Developer",
      value: "SD",
    },
    {
      label: "Frontend Developer",
      value: "FD",
    },
    {
      label: "Product Manager",
      value: "PM",
    },
  ]
  
  export function Combobox() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
   
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {value
              ? jobtitle.find((jobtitle) => jobtitle.value === value)?.label
              : "Select Job title..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {jobtitle.map((jobtitle) => (
                  <CommandItem
                    key={jobtitle.value}
                    value={jobtitle.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === jobtitle.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {jobtitle.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
  