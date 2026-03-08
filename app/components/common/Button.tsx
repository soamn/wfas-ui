import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        {...props}
        className={`
          w-full
          px-4 py-2
          rounded-md
          font-semibold
          transition
          active:scale-[0.98]
          disabled:opacity-50
          cursor-pointer
          // Default styles, can be overridden by className
          bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
          text-white dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${className}
        `}
      >
        {props.text}
      </button>
    );
  },
);

ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;
