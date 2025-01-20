"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import useStore from "../stores/store";

export type Summary = {
  id: number;
  score: number;
  assessment_score?: number;
  name: string;
  status:
    | "accepted"
    | "rejected"
    | "assessment_evaluated"
    | "assessment_submitted"
    | "assessment_generated";
  email: string;
  role_id: number;
};

// Function to create columns with role_id
export const createColumns = (role_id: string): ColumnDef<Summary>[] => [
  {
    accessorKey: "name",
    header: "Candidate Name",
    cell: ({ row }) => {
      const name = row.getValue("name");
      const displayName =
        name !== undefined && name !== null ? String(name) : "---";
      return <div className="capitalize">{displayName}</div>;
    },
  },
  {
    accessorKey: "score",
    header: () => <div className="">Profile Score</div>,
    cell: ({ row }) => {
      const score = row.getValue("score") as number; // Type assertion to number
      const displayScore =
        score !== undefined && score !== null
          ? parseFloat(String(score))
          : "---";
      const scoreColor = score > 40 ? "text-green-600" : "text-red-600"; // Green for eligible, red for not eligible
      return <div className={`font-bold ${scoreColor}`}>{displayScore}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const be_status = row.getValue("status") as string;
      const status =
        be_status !== undefined && be_status !== null ? be_status : "---";
      let color: string = "";
      const name: string =
        status === "assessment_evaluated"
          ? "Assessment Evaluated"
          : status === "assessment_submitted"
          ? "Assessment Submitted"
          : status === "assessment_generated"
          ? "Assessment Generated"
          : status === "accepted"
          ? "Assesment Pending"
          : status;

      if (status === "assessment_evaluated") {
        color = "text-blue-600"; // Deep blue for evaluated
      } else if (status === "assessment_submitted") {
        color = "text-yellow-600"; // Deeper yellow for submitted
      } else if (status === "assessment_generated") {
        color = "text-purple-500"; // Purple for generated
      } else if (status === "accepted") {
        color = "text-orange-500"; // Orange for processing
      }

      return <div className={`capitalize ${color}`}>{name}</div>;
    },
  },
  {
    accessorKey: "assessmentscore",
    header: () => <div className="">Assessment score</div>,
    cell: ({ row }) => {
      const finalscore = row.original.assessment_score;
      const sc: string =
        finalscore !== undefined && finalscore !== null
          ? `${finalscore}`
          : "---";
      return <div className="font-medium">{sc}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidateid = row.original.id;
      // const assessment_score = row.original.assessment_score;
      const be_status = row.original.status;
      console.log(row.original);
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
                sessionStorage.setItem(
                  "USER_PROF",
                  JSON.stringify(row.original)
                );
                redirect(
                  `/candidate?role_id=${role_id}&profile_id=${candidateid}`
                );
              }}
            >
              Profile View
            </DropdownMenuItem>
            {be_status === "accepted" ||
            be_status === null ||
            be_status === "assessment_generated" ? (
              <DropdownMenuItem
                onClick={() => {
                  const baseUrl = window.location.origin;
                  const assessmentLink = `${baseUrl}/assessment?role_id=${role_id}&profile_id=${candidateid}`;
                  navigator.clipboard
                    .writeText(assessmentLink)
                    .then(() => {
                      alert("Assessment link copied to clipboard");
                    })
                    .catch((err) => {
                      console.error("Failed to copy text: ", err);
                    });
                }}
              >
                Copy Assessment Link
              </DropdownMenuItem>
            ) : null}
            {be_status === "assessment_submitted" ? (
              <DropdownMenuItem>
                <Link
                  href={`/assessment-result?role_id=${role_id}&profile_id=${candidateid}`}
                >
                  Evaluate Assessment
                </Link>
              </DropdownMenuItem>
            ) : null}
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
  pageSize = 10,
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

  const { authtoken, apiUrl } = useStore();

  const fetchJD = useCallback(
    async (initialLoad: boolean = false): Promise<void> => {
      if (initialLoad && setLoading) setLoading(true);

      try {
        const response = await axios.get(`${apiUrl}/profiles`, {
          params: {
            role_id: roleid,
          },
          headers: {
            Authorization: `Bearer ${authtoken}`, // Include the authorization token
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: Summary[] = response.data;
        console.log(data);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (initialLoad && setLoading) setLoading(false);
      }
    },
    [roleid, setLoading, authtoken, apiUrl]
  );

  useEffect(() => {
    fetchJD(true);

    const intervalId = setInterval(() => {
      fetchJD();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchJD, roleid, refreshTrigger]);

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
      <ScrollArea className="rounded-md border" style={{ maxHeight: "500px" }}>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-black sticky top-0 bg-white z-10 text-xs sm:text-sm"
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
