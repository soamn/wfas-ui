"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { WorkflowState } from "../../dashboard/page";
import Link from "next/link";
import { useState } from "react";
import { PiTrashFill } from "react-icons/pi"; // Using PiTrashFill from react-icons/pi

const formatSmartTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Today • ${time}`;
  if (isYesterday) return `Yesterday • ${time}`;

  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} • ${time}`;
};

const statusColors: Record<string, string> = {
  Running: " text-yellow-700",
  Completed: " text-green-700",
  Scheduled: " text-sky-700",
  Inactive: " text-red-700",
};

export function WorkflowTable({
  data,
  onSelect,
  selectedId,
  onDeleteWorkflow,
}: {
  data: WorkflowState[];
  onSelect: (wf: WorkflowState) => void;
  selectedId?: string;
  onDeleteWorkflow: (workflowId: string) => void;
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] =
    useState<WorkflowState | null>(null);

  const columns: ColumnDef<WorkflowState>[] = [
    {
      accessorKey: "name",
      header: "Workflow",
      cell: ({ row }) => (
        <div className="font-medium text-zinc-700 dark:text-zinc-200">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "state",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            statusColors[row.original.state]
          }`}
        >
          {row.original.state}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => formatSmartTime(row.original.updatedAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/workflow/${row.original.id}`}
            className="text-blue-500 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={() => {
              setWorkflowToDelete(row.original);
              setShowConfirmDelete(true);
            }}
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-red-500"
            title="Delete Workflow"
          >
            <PiTrashFill size={18} />
          </button>
        </div>
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
      <table className="w-full text-sm ">
        <thead className="border-b">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left px-4 py-2 font-medium "
                >
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
              onClick={() => onSelect(row.original)}
              className={`hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition ${
                selectedId === row.original.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                  : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold dark:text-white">
              Are you absolutely sure?
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              This action cannot be undone. This will permanently delete the
              workflow &quot;{workflowToDelete?.name}&quot; and remove all its
              associated data.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (workflowToDelete) {
                    onDeleteWorkflow(workflowToDelete.id);
                    setWorkflowToDelete(null);
                  }
                  setShowConfirmDelete(false);
                }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
