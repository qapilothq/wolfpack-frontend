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

type Props = {
  selectedValue: string;
  onSelect: (value: string) => void;
};

interface JobData {
  id: string;
  name: string;
}

interface RoleData {
  id: string;
  name: string;
}
const Combobox: React.FC<Props> = ({ selectedValue, onSelect }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<JobData[]>(() => {
    const storedRoles = sessionStorage.getItem("ROLES");
    return storedRoles ? JSON.parse(storedRoles) : [];
  });
  const [isLoading, setIsLoading] = React.useState(!data.length);

  const { authtoken, apiUrl, selectedRole } = useStore();

  useEffect(() => {
    const fetchJD = async () => {
      if (data.length > 0) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/roles`, {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        });
        if (response.status === 200) {
          const newData = response.data.map((role: RoleData) => ({
            ...role,
            id: String(role.id),
          }));
          setData(newData);
          console.log("Data loaded from API:", newData);
          sessionStorage.setItem("ROLES", JSON.stringify(newData));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJD();
  }, [authtoken, apiUrl, data.length]);

  const getSelectedJobTitle = () => {
    if (isLoading) return "Loading...";

    const effectiveValue = selectedValue || selectedRole;
    if (!effectiveValue) return "Select Job title...";

    // Ensure we're comparing strings
    const effectiveValueStr = String(effectiveValue);
    console.log("Looking for job with ID:", effectiveValueStr);
    console.log("Available jobs:", data);

    const selectedJob = data.find(
      (job) => String(job.id) === effectiveValueStr
    );
    console.log("Found job:", selectedJob);

    return selectedJob?.name || "Search Job Title...";
  };

  const selectedJobTitle = getSelectedJobTitle();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
          disabled={isLoading}
        >
          {selectedJobTitle}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search Job Title..." />
          <CommandList>
            <CommandEmpty>No job titles found.</CommandEmpty>
            <CommandGroup>
              {data.map((job) => (
                <CommandItem
                  key={job.id}
                  onSelect={() => {
                    onSelect(job.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(selectedValue) === String(job.id) ||
                        String(selectedRole) === String(job.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {job.name}
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
