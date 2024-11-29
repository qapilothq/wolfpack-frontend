"use client"

import React, {useEffect} from 'react'
import Link from 'next/link'
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


// const data: Summary[] = [
//   {
//     id: "m5gr84i9",
//     name: "ABCDEFGHIJKLMNOP",
//     score: 70,
//     status: "approved",
//     email: "ken99@yahoo.com",
    
//   },
//   {
//     id: "3u1reuv4",
//     name: "ABCD",
//     score: 75,
//     status: "assessmentsent",
//     email: "Abe45@gmail.com",
//   },
//   {
//     id: "derv1ws0",
//     name: "ABCD",
//     score: 86,
//     status: "assessmentdone",
//     email: "Monserrat44@gmail.com",
//     assessmentscore : 75
//   },
//   {
//     id: "5kma53ae",
//     name: "ABCD",
//     score: 35,
//     status: "rejected",
//     email: "Silas22@gmail.com",
//   },
//   {
//     id: "bhqecj4p",
//     name: "ABCD",
//     score: 90,
//     status: "assessmentdone",
//     email: "carmella@hotmail.com",
//     assessmentscore : 75
//   },
// ]

export type Summary = {
  id: number
  score: number
  assessmentscore?: number
  name: string
  status: "approved" | "rejected" | "assessmentsent" | "assessmentdone"
  email: string,
}


export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Candidate Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Email
//           <ArrowUpDown />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
  {
    accessorKey: "score",
    header: () => <div className="">Profile Score</div>,
    cell: ({ row }) => {
      const score = parseFloat(row.getValue("score"))

      // Format the amount as a dollar amount

      return <div className="font-medium">{score}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status")
        const score = parseInt(row.getValue("score"))
        let color: string = ""
        let name : string = ""
        if(score > 65){
            name = "Eligible"
            color = "text-[#36454F]"
        }else{
            name = "Not Eligible"
            color = "text-[#FF0000]"
        }

      return <div className={`capitalize ${color}` } >{name}</div>
    },
  },
  
  {
    accessorKey: "assessmentscore",
    header: () => <div className="">Assessment score</div>,
    cell: ({ row }) => {
      const finalscore = row.getValue("assessmentscore")
      let sc: string = ""
      // Format the amount as a dollar amount
      if(finalscore){
        sc = `${finalscore}`
      }else{
        sc = "--"
      }

      return <div className="font-medium">{sc}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      const candidateid = row.getValue("id")

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
                return <Link href={`/candidate?id=${candidateid}`}></Link>
            }}
            >
            Profile View</DropdownMenuItem>
            <DropdownMenuItem>Send Assessment Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

type props = {
  roleid: String
}

const DataTable: React.FC<props> = (roleid) => {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [data, setData] = React.useState<any[]>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  useEffect(()=>{
    const fetchJD = async () =>{
      const getdata = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
        method: "POST",
        headers: {
          "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
        },
        body: JSON.stringify({
          "requestType" : "getProfiles",
          "role_id": roleid.roleid
          }), 
      });
      if(getdata.ok){
        const data = await getdata.json();
        setData(data);
        console.log(data);
      }else{
        console.log("Error")
      }
    }

    fetchJD();
  }, [roleid])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
       
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTable