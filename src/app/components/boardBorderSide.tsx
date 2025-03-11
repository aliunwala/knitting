import Cell from "./cell";
type BoardBorderSideProps = {
  numberOfCellsTall: number;
  cellHeight: number;
  cellWidth: number;
};
export default function BoardBorderSide({
  numberOfCellsTall,
  cellHeight,
  cellWidth,
}: BoardBorderSideProps) {
  return (
    <>
      {" "}
      {Array(numberOfCellsTall)
        .fill(0)
        .map((val, idx) => {
          return (
            <Cell
              key={idx + "_" + "borderCellSide"}
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              isBorderCell={true}
              row={0}
              col={0}
              handleCellClick={() => {}}
            >
              {numberOfCellsTall - idx}
            </Cell>
          );
        })}
    </>
  );
}
