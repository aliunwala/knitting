"use client";
import { on } from "events";
import Cell from "./cell";
import { useState } from "react";
import { modify2DArray } from "../utils/helperFunctions";

export default function Board() {
  const [cellColor, setCellColor] = useState("#FF0000");
  const [rowLen, setRowLen] = useState(10);
  const [rowNum, setRowNum] = useState(10);
  function initalBoardState(rowLen: number, rowNum: number) {
    let boardState: Array<string>[] = []; //Array(rowNum).fill(Array(rowLen).fill("x"));
    for (let i = 0; i < rowNum; i++) {
      boardState.push(new Array(rowLen).fill("#000000"));
    }
    return boardState;
  }
  const [board, setBoard] = useState(initalBoardState(rowLen, rowNum));

  function handleCellClick(e, row, col) {
    setBoard((state) => modify2DArray(state, row, col, cellColor));
    e.target.style.background = cellColor;
  }

  return (
    <>
      <br></br>
      <label htmlFor="color-select">Choose a color:</label>
      <select
        value={cellColor} // ...force the select's value to match the state variable...
        onChange={(e) => setCellColor(e.target.value)} // ... and update the state variable on any change!
        name="colors"
        id="color-select"
      >
        <option value="">--Please choose an option--</option>
        <option value="#FF0000">Red</option>
        <option value="#4169E1">Blue</option>
        <option value="#00FF00">Green</option>
        <option value="#FFA500">Orange</option>
        <option value="#9F2B68">Purple</option>
        <option value="#11ffe3">Teal</option>
      </select>
      <br></br>
      <br></br>
      {board.map((rowArr: Array<any>, row, arr) => {
        return [
          rowArr.map((cellVal: any, col) => {
            return (
              <Cell
                key={row + "_" + col}
                row={row}
                col={col}
                cellColor={cellColor}
                handleCellClick={(e) => handleCellClick(e, row, col)}
                // onCellClick={() => onCellClick(row, col)}
              ></Cell>
            );
          }),
          <br key={row + "_"}></br>,
        ];
      })}
    </>
  );
}
