"use client";
// import { on } from "events";
import Cell from "./cell";
import { useCallback, useEffect, useState } from "react";
import {
  copyTextToClipboard,
  downloadText,
  initalBoardState,
  modify2DArray,
  cellDimensions,
} from "../utils/helperFunctions";
import ColorSelect from "./select";
import BoardBorderTopBottom from "./boardBorderTopBottom";
import BoardBorderSide from "./boardBorderSide";
import BoardCenter from "./boardCenter";

export default function Board() {
  /**
   * Constants
   */
  const colorsEnum = {
    White: "#FFFFFF",
    Red: "#FF0000",
    Blue: "#4169E1",
    Green: "#00FF00",
    Orange: "#FFA500",
    Purple: "#9F2B68",
  };
  const defaultCellWidth = 34;
  const defaultCellHeight = 34;
  /**
   * State & Derived State
   */
  const [stichesPerInch, setStichesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(10);
  const [projectWidth, setProjectWidth] = useState(1);
  const [projectHeight, setProjectHeight] = useState(1);
  const [fillColor, setFillColor] = useState("#FFFFFF");
  const [cellColor, setCellColor] = useState("#FFFFFF");
  const [userSavedBoardState, setUserSavedBoardState] = useState("");
  const numberOfCellsWide = stichesPerInch * projectWidth;
  const numberOfCellsTall = rowsPerInch * projectHeight;
  const { cellHeight, cellWidth } = cellDimensions(
    projectWidth,
    projectHeight,
    numberOfCellsWide,
    numberOfCellsTall,
    defaultCellWidth,
    defaultCellHeight
  );
  const [board, setBoard] = useState(
    initalBoardState(numberOfCellsWide, numberOfCellsTall)
  );

  /**
   * Effects
   */
  useEffect(() => {
    console.log("Setting initial board state");
    if (
      board.length !== numberOfCellsTall ||
      board[0].length !== numberOfCellsWide
    ) {
      setBoard(initalBoardState(numberOfCellsWide, numberOfCellsTall));
    }
  }, [numberOfCellsWide, numberOfCellsTall, board]);

  /**
   * Handlers
   */
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const newCell = { color: cellColor };
      setBoard((state) => modify2DArray(state, row, col, newCell));
    },
    [cellColor]
  );
  //   function handleCellClick(e: any, row: number, col: number) {
  //     const newCell = { ...board[row][col], color: cellColor };
  //     setBoard((state) => modify2DArray(state, row, col, newCell));
  //   }
  function handleColorAllCellsToOneColor(e: any) {
    // setFillColor(e.target.value);
    setBoard((state) =>
      initalBoardState(numberOfCellsWide, numberOfCellsTall, fillColor)
    );
  }

  return (
    <>
      {/**
       * User inputs
       */}
      <label htmlFor="StitchesPerInch">Sitches Per inch (left-right):</label>
      <input
        type="number"
        id="StitchesPerInch"
        name="StitchesPerInch"
        value={stichesPerInch}
        onChange={(e) => {
          if (Number(e.target.value) >= 1 && Number(e.target.value) <= 25) {
            setStichesPerInch(Number(e.target.value));
          }
        }}
        className="outline-solid outline outline-blue-500 h-10"
      ></input>

      <label htmlFor="RowsPerInch">Rows Per inch (up-down):</label>
      <input
        type="number"
        id="RowsPerInch"
        name="RowsPerInch"
        value={rowsPerInch}
        onChange={(e) => {
          if (Number(e.target.value) >= 1 && Number(e.target.value) <= 25) {
            setRowsPerInch(Number(e.target.value));
          }
        }}
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
      {/**
       * Display the cell calculations based on user inputs
       */}
      <div className="flex items-center justify-center">
        <div className="border-blue-500 border p-2">{`${numberOfCellsWide} cells wide ↔️ x ${numberOfCellsTall} cells high ↕️`}</div>
      </div>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
      <br></br>
      {/**
       * Cell painting options
       */}
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
      {/**
       * Actual board with cells
       */}
      <BoardBorderTopBottom
        numberOfCellsWide={numberOfCellsWide}
        cellWidth={cellWidth}
        defaultCellHeight={defaultCellHeight}
      ></BoardBorderTopBottom>
      <div className="flex">
        <div>
          <BoardBorderSide
            numberOfCellsTall={numberOfCellsTall}
            cellHeight={cellHeight}
            cellWidth={cellWidth}
          ></BoardBorderSide>
        </div>
        <div>
          <BoardCenter
            board={board}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            handleCellClick={handleCellClick}
          ></BoardCenter>
        </div>
        <div>
          {" "}
          <BoardBorderSide
            numberOfCellsTall={numberOfCellsTall}
            cellHeight={cellHeight}
            cellWidth={cellWidth}
          ></BoardBorderSide>
        </div>
      </div>
      <BoardBorderTopBottom
        numberOfCellsWide={numberOfCellsWide}
        cellWidth={cellWidth}
        defaultCellHeight={defaultCellHeight}
      ></BoardBorderTopBottom>
      <br></br>

      {/**
       * Update the board with saved state
       */}
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
      {/**
       * Copy state to clipboard
       */}
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

      {/**
       * Download state to file
       */}
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
