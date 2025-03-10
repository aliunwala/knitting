import { MouseEventHandler } from "react";

type CellProps = {
  handleCellClick?: MouseEventHandler<HTMLElement>;
  children?: any;
  row?: number;
  col?: number;
  cellColor?: string;
  projectWidth: number;
  projectHeight: number;
};

export default function Cell({
  children,
  row,
  col,
  cellColor,
  projectWidth,
  projectHeight,
  handleCellClick,
}: CellProps) {
  // function onMouseOverHandler() {
  //   console.log("onMouseOverHandler");
  // }
  let cellWidth = 34;
  let cellHeight = 34;
  if (projectHeight > projectWidth) {
    cellWidth = Math.floor(cellWidth * (projectWidth / projectHeight));
  }
  if (projectWidth > projectHeight) {
    cellHeight = Math.floor(cellHeight * (projectHeight / projectWidth));
  }
  return (
    <div
      className="cell"
      style={{
        background: cellColor,
        height: `${cellHeight}px`,
        width: `${cellWidth}px`,
      }}
      onClick={handleCellClick}
      // onMouseOver={onMouseOverHandler}
    ></div>
  );
}
