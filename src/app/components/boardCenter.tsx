import BoardCell from "./boardCell";
import Cell from "./cell";

type BoardCenterProps = {
  board: Array<Array<any>>;
  cellWidth: number;
  cellHeight: number;
  handleCellClick: (row: number, col: number) => void;
  onMouseDown: Function;
  onMouseEnter: Function;
  onMouseUp: Function;
  activeRow?: number;
  knittingMode: boolean;
};

export default function BoardCenter({
  board,
  cellWidth,
  cellHeight,
  handleCellClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  activeRow,
  knittingMode,
}: BoardCenterProps) {
  const boardCellsResult = board.map((rowArr: Array<any>, row, arr) => {
    return (
      <div
        key={row + "divforcells"}
        className={`flex ${
          knittingMode &&
          activeRow &&
          Math.abs(board.length - activeRow) !== row
            ? "inactiveRow"
            : ""
        }`}
      >
        {rowArr.map((cellVal: any, col) => {
          return (
            <BoardCell
              key={row + "_" + col + "_boardCell"}
              //   cellColor={"#ff0000"}
              cellColor={cellVal.color}
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              row={row}
              col={col}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
              handleCellClick={handleCellClick}
            ></BoardCell>
          );
        })}
      </div>
    );
  });

  return boardCellsResult;
}
