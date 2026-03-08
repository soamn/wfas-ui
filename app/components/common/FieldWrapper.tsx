export const FieldWrapper = ({ label, children, error }: any) => (
  <div className="space-y-1.5 group flex flex-col w-full">
    <div className="flex items-center justify-between px-0.5">
      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none select-none transition-colors group-focus-within:text-blue-500">
        {label}
      </label>

      {!error && (
        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      )}
    </div>

    <div className="relative">{children}</div>

    {error && (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/5 dark:bg-red-500/10 border-l-2 border-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
        <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold leading-tight">
          {error}
        </span>
      </div>
    )}
  </div>
);
