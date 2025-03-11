import React from "react";
import { MouseEventHandler } from "react";

type CellProps = {
  // handleCellClick?: MouseEventHandler<HTMLElement>;
  handleCellClick: (row: number, col: number) => void;
  children?: any;
  row: number;
  col: number;
  cellColor?: string;
  // projectWidth: number;
  // projectHeight: number;
  // numberOfCellsWide: number;
  // numberOfRowsTall: number;
  isBorderCell?: boolean;
  cellHeight: number;
  cellWidth: number;
};

function MyCell({
  children,
  cellColor,
  isBorderCell = false,
  cellHeight,
  cellWidth,
  row,
  col,
  handleCellClick,
}: CellProps) {
  // function onMouseOverHandler() {
  //   console.log("onMouseOverHandler");
  // }

  const boardCell = (
    <div
      className="cell"
      style={{
        background: cellColor,
        minHeight: `${cellHeight}px`,
        minWidth: `${cellWidth}px`,
      }}
      onClick={(e) => handleCellClick(row, col)}
      // onMouseOver={onMouseOverHandler}
    >
      {children}
    </div>
  );

  const borderCell = (
    <div
      className="cell"
      style={{
        minHeight: `${cellHeight}px`,
        minWidth: `${cellWidth}px`,
        maxHeight: `${cellHeight}px`,
        maxWidth: `${cellWidth}px`,
      }}
    >
      {children}
    </div>
  );

  return <>{isBorderCell ? borderCell : boardCell}</>;
}
const Cell = React.memo(MyCell);

export default Cell;
