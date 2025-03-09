"use client";
import { on } from "events";
import Cell from "./cell";
import { useState } from "react";
import { modify2DArray } from "../utils/helperFunctions";

export default function Board() {
  const [fillColor, setFillColor] = useState("#FF0000");
  const [cellColor, setCellColor] = useState("#FF0000");
  const [userSavedBoardState, setUserSavedBoardState] = useState("");
  const [rowLen, setRowLen] = useState(10);
  const [rowNum, setRowNum] = useState(10);
  function initalBoardState(rowLen: number, rowNum: number, color = "#FFFFFF") {
    const boardState: Array<{ color: string }>[] = []; //Array(rowNum).fill(Array(rowLen).fill("x"));
    for (let i = 0; i < rowNum; i++) {
      boardState.push(new Array(rowLen).fill({ color: color }));
    }
    return boardState;
  }
  const [board, setBoard] = useState(initalBoardState(rowLen, rowNum));

  function handleCellClick(e: any, row: number, col: number) {
    const newBoard = { ...board[row][col], color: cellColor };
    setBoard((state) => modify2DArray(state, row, col, newBoard));
    e.target.style.background = cellColor;
  }

  return (
    <>
      <br></br>
      <label htmlFor="color-select">Choose a color to fill all cells:</label>
      <select
        value={fillColor} // ...force the select's value to match the state variable...
        onChange={(e) => {
          setFillColor(e.target.value);
          setBoard((state) => initalBoardState(rowLen, rowNum, e.target.value));
        }} // ... and update the state variable on any change!
        name="colors"
        id="color-select"
        className="bg-transparent hover:bg-blue-50 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        <option value="">Please choose color option:</option>
        <option value="#FF0000">Red</option>
        <option value="#4169E1">Blue</option>
        <option value="#00FF00">Green</option>
        <option value="#FFA500">Orange</option>
        <option value="#9F2B68">Purple</option>
        <option value="#11ffe3">Teal</option>
      </select>
      <br></br>
      <label htmlFor="color-select">Choose a color:</label>
      <select
        value={cellColor} // ...force the select's value to match the state variable...
        onChange={(e) => setCellColor(e.target.value)} // ... and update the state variable on any change!
        name="colors"
        id="color-select"
        className="bg-transparent hover:bg-blue-50 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        <option value="">Please choose color option:</option>
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
        return (
          <div key={row + "divforcells"} className="flex">
            {rowArr.map((cellVal: any, col) => {
              return (
                <Cell
                  key={row + "_" + col}
                  row={row}
                  col={col}
                  cellColor={board[row][col].color}
                  handleCellClick={(e) => handleCellClick(e, row, col)}
                ></Cell>
              );
            })}
          </div>
        );
      })}
      <br></br>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(userSavedBoardState);
          setBoard((state) => {
            // let newState = JSON.parse(userSavedBoardState)
            // function revalidateBoardColors(newState){
            // }
            return JSON.parse(userSavedBoardState);
          });
        }}
      >
        <label htmlFor="boardState">Saved board state:</label>
        <br></br>
        <input
          type="text"
          id="boardState"
          name="boardState"
          value={userSavedBoardState}
          onChange={(e) => {
            setUserSavedBoardState(e.target.value);
          }}
        ></input>
        <br></br>
        <button
          className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          type="submit"
          value="Submit"
        >
          Update the board
        </button>
      </form>

      <br></br>
      <button
        onClick={() => console.log(JSON.stringify(board))}
        type="button"
        className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Print state to console
      </button>
    </>
  );
}
