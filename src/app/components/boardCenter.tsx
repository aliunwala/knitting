import Cell from "./cell";

type BoardCenterProps = {
  board: Array<Array<any>>;
  cellWidth: number;
  cellHeight: number;
  handleCellClick: (row: number, col: number) => void;
};

export default function BoardCenter({
  board,
  cellWidth,
  cellHeight,
  handleCellClick,
}: BoardCenterProps) {
  const boardCellsResult = board.map((rowArr: Array<any>, row, arr) => {
    return (
      <div key={row + "divforcells"} className="flex">
        {rowArr.map((cellVal: any, col) => {
          return (
            <Cell
              key={row + "_" + col + "_boardCell"}
              //   cellColor={"#ff0000"}
              cellColor={cellVal.color}
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              row={row}
              col={col}
              handleCellClick={handleCellClick}
            ></Cell>
          );
        })}
      </div>
    );
  });

  return boardCellsResult;
}
