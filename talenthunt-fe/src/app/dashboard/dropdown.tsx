"use client";
import React, { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useStore from "../stores/store";
import axios from "axios";

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
  selectedValue: string;
  onSelect: (value: string) => void;
};

interface JobData {
  id: string;
  name: string;
}

const Combobox: React.FC<props> = ({ selectedValue, onSelect }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<JobData[]>([]);

  const { authtoken, apiUrl } = useStore();

  useEffect(() => {
    const fetchJD = async () => {
      try {
        const response = await axios.get(`${apiUrl}/roles`, {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        });
        if (response.status === 200) {
          const data = response.data;
          setData(data);
          sessionStorage.setItem("ROLES", JSON.stringify(data));
          console.log(data);
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchJD();
  }, [authtoken, apiUrl]);

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
                    setOpen(false);
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
  );
};

export default Combobox;
