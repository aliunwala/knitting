"use client";
// import { on } from "events";
import Cell from "./cell";
import { useEffect, useState } from "react";
import {
  copyTextToClipboard,
  downloadText,
  initalBoardState,
  modify2DArray,
} from "../utils/helperFunctions";
import ColorSelect from "./select";
export default function Board() {
  const colorsEnum = {
    White: "#FFFFFF",
    Red: "#FF0000",
    Blue: "#4169E1",
    Green: "#00FF00",
    Orange: "#FFA500",
    Purple: "#9F2B68",
  };
  const [stichesPerInch, setStichesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(10);
  const [projectWidth, setProjectWidth] = useState(2);
  const [projectHeight, setProjectHeight] = useState(4);
  const [fillColor, setFillColor] = useState("#FFFFFF");
  const [cellColor, setCellColor] = useState("#FFFFFF");
  const [userSavedBoardState, setUserSavedBoardState] = useState("");
  const rowLen = stichesPerInch * projectWidth;
  const rowNum = rowsPerInch * projectHeight;

  const [board, setBoard] = useState(initalBoardState(rowLen, rowNum));

  useEffect(() => {
    console.log("Setting initial board state");
    if (board.length !== rowNum || board[0].length !== rowLen) {
      setBoard(initalBoardState(rowLen, rowNum));
    }
  }, [rowLen, rowNum, board]);

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
      <label htmlFor="StitchesPerInch">Sitches Per inch (left-right):</label>
      <input
        type="number"
        id="StitchesPerInch"
        name="StitchesPerInch"
        min="1"
        value={stichesPerInch}
        onChange={(e) => setStichesPerInch(Number(e.target.value))}
        className="outline-solid outline outline-blue-500 h-10"
      ></input>

      <label htmlFor="RowsPerInch">Rows Per inch (up-down):</label>
      <input
        type="number"
        id="RowsPerInch"
        name="RowsPerInch"
        min="1"
        value={rowsPerInch}
        onChange={(e) => setRowsPerInch(Number(e.target.value))}
        className="outline-solid outline outline-blue-500 h-10"
      ></input>
      <br></br>
      <br></br>
      <label htmlFor="ProjectWidth">Project Width (left-right inches):</label>
      <input
        type="number"
        id="ProjectWidth"
        name="ProjectWidth"
        min="1"
        value={projectWidth}
        onChange={(e) => {
          setProjectWidth(Number(e.target.value));
        }}
        className="outline-solid outline outline-blue-500 h-10"
      ></input>

      <label htmlFor="ProjectHeight">Project Height (up-down inches):</label>
      <input
        type="number"
        id="ProjectHeight"
        name="ProjectHeight"
        min="1"
        value={projectHeight}
        onChange={(e) => {
          setProjectHeight(Number(e.target.value));
        }}
        className="outline-solid outline outline-blue-500 h-10"
      ></input>
      <br></br>
      <br></br>
      <br></br>
      <div className="flex items-center justify-center">
        <div className="border-blue-500 border p-2">{`${rowLen} cells wide ↔️ x ${rowNum} cells high ↕️`}</div>
      </div>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
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
                  projectWidth={projectWidth}
                  projectHeight={projectHeight}
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
            JSONuserSavedBoardStateTEMP = JSONuserSavedBoardState;
            // return JSONuserSavedBoardState;
          } catch (e) {
            console.log("Error when updating board state: " + e);
          }
          setStichesPerInch(JSONuserSavedBoardStateTEMP.stichesPerInch);
          setRowsPerInch(JSONuserSavedBoardStateTEMP.rowsPerInch);
          setProjectHeight(JSONuserSavedBoardStateTEMP.projectHeight);
          setProjectWidth(JSONuserSavedBoardStateTEMP.projectWidth);
          setBoard(JSONuserSavedBoardStateTEMP.board);
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
          const boardStateToPrint = String(
            JSON.stringify({
              board,
              stichesPerInch,
              rowsPerInch,
              projectHeight,
              projectWidth,
            })
          );
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
          const boardStateToPrint = String(
            JSON.stringify({
              board,
              stichesPerInch,
              rowsPerInch,
              projectHeight,
              projectWidth,
            })
          );
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
