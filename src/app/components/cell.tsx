import { MouseEventHandler } from "react";

type CellProps = {
  handleCellClick?: MouseEventHandler<HTMLButtonElement>;
  children?: any;
  row?: number;
  col?: number;
  cellColor?: string;
};

export default function Cell({
  children,
  row,
  col,
  cellColor,
  handleCellClick,
}: CellProps) {
  // function onMouseOverHandler() {
  //   console.log("onMouseOverHandler");
  // }
  return (
    <button
      className="cell"
      onClick={handleCellClick}
      // onMouseOver={onMouseOverHandler}
    >
      {children}
    </button>
  );
}
