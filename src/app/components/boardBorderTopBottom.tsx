import Cell from "./cell";
type BoardBorderTopBottomProps = {
  numberOfCellsWide: number;
  cellWidth: number;
  defaultCellHeight: number;
  reflect?: boolean;
};

export default function BoardBorderTopBottom({
  numberOfCellsWide,
  cellWidth,
  defaultCellHeight,
  reflect,
}: BoardBorderTopBottomProps) {
  const midpoint = Math.floor((numberOfCellsWide + 2) / 2);
  return (
    <div className="flex">
      {Array(numberOfCellsWide + 2)
        .fill(0)
        .map((val, idx) => {
          let res;

          if (reflect) {
            if (idx < midpoint) {
              res = midpoint - idx;
            } else {
              res = idx - midpoint + 1;
            }
          } else {
            if (idx < midpoint + 1) {
              res = midpoint + 1 - idx;
            } else {
              res = idx - midpoint;
            }
          }

          if (idx === 0 || idx === numberOfCellsWide + 1) {
            res = "";
          }
          return (
            <Cell
              key={idx + "_" + "borderCellTop"}
              cellHeight={defaultCellHeight}
              cellWidth={cellWidth}
              isBorderCell={true}
              row={0}
              col={0}
              handleCellClick={() => {}}
            >
              {res}
            </Cell>
          );
        })}
    </div>
  );
}
