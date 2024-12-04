"use client"
import React, {useEffect} from 'react'
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

// const jobtitle = [
//     {
//       label: "Solution Architect",
//       value: "SA",
//     },
//     {
//       label: "Software Developer",
//       value: "SD",
//     },
//     {
//       label: "Frontend Developer",
//       value: "FD",
//     },
//     {
//       label: "Product Manager",
//       value: "PM",
//     },
//   ]
  type props = {
    selectedValue: string
    onSelect: (value: string) => void
  }

  interface JobData {
    id: string;
    name: string;
  }
  
const Combobox: React.FC<props> = ({ selectedValue, onSelect }) => {
    const [open, setOpen] = React.useState(false)
    const [data, setData] = React.useState<JobData[]>([]); 

    useEffect(()=>{
      const fetchJD = async () =>{
        const resumematch = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
          method: "POST",
          headers: {
            "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
          },
          body: JSON.stringify({
            "requestType" : "getRoles",
            }), 
        });
        if(resumematch.ok){
          const data = await resumematch.json();
          setData(data);
          sessionStorage.setItem("ROLES", JSON.stringify(data));
          console.log(data);
        }else{
          console.log("Error")
        }
      }

      fetchJD();
    }, [])
   
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {selectedValue
              ? data.find((data) => data.id === selectedValue)?.name
              : "Select Job title..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search Job Title..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {data.map((data) => (
                  <CommandItem
                    key={data.id}
                    onSelect={() => {
                      onSelect(data.id);
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === data.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {data.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  export default Combobox
  