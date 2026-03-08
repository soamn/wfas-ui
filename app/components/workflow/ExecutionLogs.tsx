"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PiTrashFill } from "react-icons/pi";

export interface ExecutionLog {
  id: string;
  status: "SUCCESS" | "RUNNING" | "FAILED";
  startedAt: string;
  workflowId: string;
}

const statusColors: Record<string, string> = {
  RUNNING: " text-yellow-500",
  SUCCESS: " text-green-500",
  FAILED: " text-red-500",
};

export const ExecutionLogTable = ({
  data,
  onDeleteLog,
}: {
  data: ExecutionLog[];
  onDeleteLog: (logId: string) => void;
}) => {
  const columns: ColumnDef<ExecutionLog>[] = [
    {
      accessorKey: "id",
      header: " ID",
      cell: ({ row }) => (
        <Link
          href={`/workflow/execution/${row.original.id}`}
          className="text-blue-500 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.workflowId}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`font-mono ${statusColors[row.original.status]}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => new Date(row.original.startedAt).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteLog(row.original.id);
          }}
          className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-red-500"
          title="Delete Log"
        >
          <PiTrashFill size={18} />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-fit shadow-sm  overflow-auto rounded-md bg-zinc-50 dark:bg-zinc-900 dark:text-white ">
      <table className="w-full text-sm">
        <thead className="border-b dark:border-zinc-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left p-2 font-medium">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className=" dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExecutionLogs = ({
  logs,
  onDeleteLog,
}: {
  logs: ExecutionLog[];
  onDeleteLog: (logId: string) => void;
}) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        No executions found for this workflow.
      </div>
    );
  }

  return <ExecutionLogTable data={logs} onDeleteLog={onDeleteLog} />;
};

export default ExecutionLogs;
