import { DividerProps } from "react-split-pane";

export function CustomDivider(props: DividerProps) {
  const {
    direction,
    isDragging,
    disabled,
    onMouseDown,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
  } = props;

  return (
    <div
      role="separator"
      aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
      tabIndex={disabled ? -1 : 0}
      className={`custom-divider ${direction}${isDragging ? " dragging" : ""}`}
      onMouseDown={disabled ? undefined : onMouseDown}
      onTouchStart={disabled ? undefined : onTouchStart}
      onTouchEnd={disabled ? undefined : onTouchEnd}
      onKeyDown={disabled ? undefined : onKeyDown}
    />
  );
}
