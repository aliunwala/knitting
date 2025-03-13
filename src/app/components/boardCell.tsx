import React from "react";
import { MouseEventHandler } from "react";

type BoardCellProps = {
  // handleCellClick?: MouseEventHandler<HTMLElement>;
  handleCellClick: (row: number, col: number) => void;
  children?: any;
  row: number;
  col: number;
  cellColor?: string;
  isBorderCell?: boolean;
  cellHeight: number;
  cellWidth: number;
  onMouseDown: Function;
  onMouseEnter: Function;
  onMouseUp: Function;
};

function BoardCell({
  children,
  cellColor,
  cellHeight,
  cellWidth,
  row,
  col,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  handleCellClick,
}: BoardCellProps) {
  return (
    <>
      <div
        className="cell"
        style={{
          background: cellColor,
          minHeight: `${cellHeight}px`,
          minWidth: `${cellWidth}px`,
        }}
        onClick={(e) => handleCellClick(row, col)}
        // onMouseOver={onMouseOverHandler}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        onTouchStart={() => onMouseDown(row, col)}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const element = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (element && element instanceof HTMLElement) {
            if (element.dataset.id) {
              onMouseEnter(parseInt(element.dataset.id));
            }
          }
        }}
        onTouchEnd={() => onMouseUp()}
      >
        {children}
      </div>
    </>
  );
}

export default React.memo(BoardCell);
