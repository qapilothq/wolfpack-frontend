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
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirect } from "next/navigation";
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

const scaleScore = (score: number): number => {
  if (score > 5) {
    return Math.ceil(score / 20); // Scale score to 1-5 based on ranges
  }
  return score; // Return the score directly if it's 5 or less
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
    header: () => <div>Profile Score (out of 5)</div>,
    cell: ({ row }) => {
      const rawScore = row.getValue("score") as number;
      const score =
        rawScore !== undefined && rawScore !== null
          ? scaleScore(rawScore)
          : null;
      const displayScore = score !== null ? score : "---";
      const scoreColor =
        score !== null && score >= 3 ? "text-green-600" : "text-red-600";
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
          ? "Assessment Pending"
          : status;

      if (status === "assessment_evaluated") {
        color = "text-blue-600";
      } else if (status === "assessment_submitted") {
        color = "text-yellow-600";
      } else if (status === "assessment_generated") {
        color = "text-purple-500";
      } else if (status === "accepted") {
        color = "text-orange-500";
      }

      return <div className={`capitalize ${color}`}>{name}</div>;
    },
  },
  {
    accessorKey: "assessmentscore",
    header: () => <div>Assessment score</div>,
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
      const be_status = row.original.status;
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
            {(be_status === "accepted" ||
              be_status === null ||
              be_status === "assessment_generated") && (
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
            )}
            {be_status === "assessment_submitted" && (
              <DropdownMenuItem>
                <Link
                  href={`/assessment-result?role_id=${role_id}&profile_id=${candidateid}`}
                >
                  Evaluate Assessment
                </Link>
              </DropdownMenuItem>
            )}
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
            Authorization: `Bearer ${authtoken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: Summary[] = response.data;
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

  return (
    <div className="flex flex-col h-full relative bg-white rounded-md border">
      {/* Fixed Header */}
      <div className="overflow-x-auto">
        <div className="sticky top-0 z-20 bg-white border-b">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-black bg-gray-50 text-xs sm:text-sm font-semibold px-4 py-3 whitespace-nowrap"
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
          </Table>
        </div>
      </div>

      {/* Scrollable Table Body */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="w-full h-full">
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 whitespace-nowrap"
                      >
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
                    className="h-24 text-center text-gray-500"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Pagination Controls (sticky on larger screens) */}
      <div className="sm:sticky sm:bottom-0 border-t bg-white py-4 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of {data.length}{" "}
            candidates
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm px-2">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
