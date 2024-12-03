"use client"

import React, { useEffect, useState, useCallback } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirect } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

export type Summary = {
  id: number;
  score: number;
  assessmentscore?: number;
  name: string;
  status: "approved" | "rejected" | "assessmentsent" | "assessmentdone";
  email: string;
  role_id: number;
};

// Function to create columns with role_id
export const createColumns = (role_id: string): ColumnDef<Summary>[] => [
  {
    accessorKey: "name",
    header: "Candidate Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "score",
    header: () => <div className="">Profile Score</div>,
    cell: ({ row }) => {
      const score = parseFloat(row.getValue("score"));
      return <div className="font-medium">{score}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const score = parseInt(row.getValue("score"));
      let color: string = "";
      let name: string = "";
      if (score > 40) {
        name = "Eligible";
        color = "text-green-400";
      } else {
        name = "Not Eligible";
        color = "text-red-400";
      }

      return <div className={`capitalize ${color}`}>{name}</div>;
    },
  },
  {
    accessorKey: "assessmentscore",
    header: () => <div className="">Assessment score</div>,
    cell: ({ row }) => {
      const finalscore = row.getValue("assessmentscore");
      const sc: string = finalscore ? `${finalscore}` : "--";
      return <div className="font-medium">{sc}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidateid = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                redirect(`/candidate?role_id=${role_id}&profile_id=${candidateid}`);
              }}
            >
              Profile View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                redirect(`/assessment?role_id=${role_id}&profile_id=${candidateid}`);
              }}
            >
              Send Assessment Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type Props = {
  roleid: string;
  refreshTrigger?: number;
  pageSize?: number;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
};

const DataTable: React.FC<Props> = ({ 
  loading,
  setLoading,
  roleid, 
  refreshTrigger = 0, 
  pageSize = 10
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<Summary[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Use useCallback to memoize the fetch function
  const fetchJD = useCallback(async () => {
    if (setLoading) setLoading(true);

    try {
      const response = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
        },
        body: JSON.stringify({
          "requestType": "getProfiles",
          "role_id": roleid
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (setLoading) setLoading(false);
    }
  }, [roleid, setLoading]);

  useEffect(() => {
    fetchJD();
  }, [fetchJD, roleid, refreshTrigger]);

  // Create columns with the current roleid
  const columns = createColumns(roleid);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Rest of the component remains the same...
  return (
    <div className="w-full">
      <ScrollArea className="rounded-md border" style={{ maxHeight: '500px' }}>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className='text-black sticky top-0 bg-white z-10 text-xs sm:text-sm'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="text-xs sm:text-sm"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-2 sm:p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-2 py-4 px-2">
        <div className="text-xs sm:text-sm text-muted-foreground text-center w-full md:text-left md:w-auto">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center justify-center space-x-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="p-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <span className="text-xs sm:text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="p-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;