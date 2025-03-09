import { MouseEventHandler } from "react";

type CellProps = {
  handleCellClick?: MouseEventHandler<HTMLElement>;
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
    <div
      className="cell"
      style={{ background: cellColor }}
      onClick={handleCellClick}
      // onMouseOver={onMouseOverHandler}
    ></div>
  );
}
