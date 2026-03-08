import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`
            w-full
            px-4 py-2
            rounded-md
            border
            bg-gray-50 dark:bg-zinc-700
            border-gray-300 dark:border-zinc-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-blue-500 focus:border-blue-500
            outline-none
            transition-colors duration-200
            ${error ? "border-red-500 dark:border-red-400" : ""}
            ${className}
          `}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

InputComponent.displayName = "InputComponent";

export default InputComponent;
