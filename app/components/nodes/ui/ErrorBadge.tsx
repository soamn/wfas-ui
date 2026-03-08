import { useFlowStore } from "@/app/store/node/node.store";

export const ErrorBadge = ({ id }: { id: string }) => {
  const error = useFlowStore(
    (s) => s.nodes.find((n) => n.id === id)?.data?.error,
  );

  if (!error) return null;

  return (
    <div
      title={"error"}
      className="absolute -top-2 -right-2 w-4 h-4 bg-red-500
       text-white rounded-full flex items-center justify-center text-[10px] animate-pulse z-50 border border-white"
    >
      !
    </div>
  );
};
