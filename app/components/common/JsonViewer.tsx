"use client";

interface JsonViewerProps {
  data: object;
}

const JsonViewer = ({ data }: JsonViewerProps) => {
  return (
    <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg text-sm overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default JsonViewer;
