"use client";
// import { on } from "events";
import Cell from "./cell";
import { useState } from "react";
import {
  copyTextToClipboard,
  downloadText,
  modify2DArray,
} from "../utils/helperFunctions";
import ColorSelect from "./select";

export default function Board() {
  const colorsEnum = {
    Red: "#FF0000",
    Blue: "#4169E1",
    Green: "#00FF00",
    Orange: "#FFA500",
    Purple: "#9F2B68",
  };
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
    const newCell = { ...board[row][col], color: cellColor };
    setBoard((state) => modify2DArray(state, row, col, newCell));
  }
  function handleColorAllCellsToOneColor(e: any) {
    // setFillColor(e.target.value);
    setBoard((state) => initalBoardState(rowLen, rowNum, fillColor));
  }

  return (
    <>
      <br></br>
      <ColorSelect
        label={"Choose a color to fill all cells:"}
        cellColor={fillColor}
        setCellColor={setFillColor}
        colorsEnum={colorsEnum}
      ></ColorSelect>
      <button
        onClick={(e) => handleColorAllCellsToOneColor(e)}
        type="button"
        className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Click to color all cells
      </button>
      <br></br>
      <br></br>

      <ColorSelect
        label={"Choose a color:"}
        cellColor={cellColor}
        setCellColor={setCellColor}
        colorsEnum={colorsEnum}
      ></ColorSelect>

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
          let JSONuserSavedBoardStateTEMP: any;
          try {
            const JSONuserSavedBoardState = JSON.parse(userSavedBoardState);
            if (JSONuserSavedBoardState.length != rowNum) {
              throw new Error("Not enoungh rows in data");
            }
            if (JSONuserSavedBoardState[0].length != rowLen) {
              throw new Error("Not enoungh left to right cells in data");
            }
            JSONuserSavedBoardStateTEMP = JSONuserSavedBoardState;
            // return JSONuserSavedBoardState;
          } catch (e) {
            console.log("Error when updating board state: " + e);
          }

          if (JSONuserSavedBoardStateTEMP) {
            setBoard((state) => {
              return JSONuserSavedBoardStateTEMP;
            });
          }
        }}
      >
        <label htmlFor="boardState">Saved board state:</label>
        <br></br>
        <input
          type="text"
          id="boardState"
          name="boardState"
          value={userSavedBoardState}
          className="outline-solid outline outline-blue-500 h-10"
          onChange={(e) => {
            setUserSavedBoardState(e.target.value);
          }}
        ></input>

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
        onClick={() => {
          const boardStateToPrint = String(JSON.stringify(board));
          console.log(boardStateToPrint);
          copyTextToClipboard(boardStateToPrint);
        }}
        type="button"
        className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Copy state to clipboard
      </button>
      <button
        onClick={() => {
          const boardStateToPrint = String(JSON.stringify(board));
          console.log(boardStateToPrint);
          copyTextToClipboard(boardStateToPrint);
          downloadText(
            boardStateToPrint,
            `boardState${String(new Date().toISOString())}.txt`
          );
        }}
        type="button"
        className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Download state to computer
      </button>
    </>
  );
}
