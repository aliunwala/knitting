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
  const colorsEnum = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#000000", // black
    "#ffffff", // white
  ];
  const defaultCellWidth = 34;
  const defaultCellHeight = 34;

  /**
   * State & Derived State
   */
  const [stichesPerInch, setStichesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(10);
  const [projectWidth, setProjectWidth] = useState(1);
  const [projectHeight, setProjectHeight] = useState(1);
  // Custom color input
  const [customColor, setCustomColor] = useState("#000000");
  // const [fillColor, setFillColor] = useState(colorsEnum[0]);
  const [currentColor, setCurrentColor] = useState(colorsEnum[0]);
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
      const newCell = { color: currentColor };
      setBoard((state) => modify2DArray(state, row, col, newCell));
    },
    [currentColor]
  );
  function handleColorAllCellsToOneColor(e: any) {
    // setFillColor(e.target.value);
    setBoard((state) =>
      initalBoardState(numberOfCellsWide, numberOfCellsTall, currentColor)
    );
  }
  // Handle custom color change
  const handleCustomColorChange = (e: any) => {
    setCustomColor(e.target.value);
  };
  // Add custom color to palette
  const addCustomColor = () => {
    setCurrentColor(customColor);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Stiching Helper</h1>

        {/**
         * User inputs
         */}
        <div className="sectionDivider">
          <div className="flex gap-2 mb-2">
            <label className="text-lg font-medium " htmlFor="StitchesPerInch">
              Sitches Per inch (left-right):
            </label>
            <input
              type="number"
              id="StitchesPerInch"
              name="StitchesPerInch"
              value={stichesPerInch}
              onChange={(e) => {
                if (
                  Number(e.target.value) >= 1 &&
                  Number(e.target.value) <= 25
                ) {
                  setStichesPerInch(Number(e.target.value));
                }
              }}
              className="outline-solid outline outline-blue-500"
            ></input>
          </div>
          <div className="flex gap-2 mb-2">
            <label className="text-lg font-medium " htmlFor="RowsPerInch">
              Rows Per inch (up-down):
            </label>
            <input
              type="number"
              id="RowsPerInch"
              name="RowsPerInch"
              value={rowsPerInch}
              onChange={(e) => {
                if (
                  Number(e.target.value) >= 1 &&
                  Number(e.target.value) <= 25
                ) {
                  setRowsPerInch(Number(e.target.value));
                }
              }}
              className="outline-solid outline outline-blue-500"
            ></input>
          </div>
        </div>

        <div className="sectionDivider">
          <div className="flex gap-2 mb-2">
            <label className="text-lg font-medium " htmlFor="ProjectWidth">
              Project Width (left-right inches):
            </label>
            <input
              type="number"
              id="ProjectWidth"
              name="ProjectWidth"
              min="1"
              value={projectWidth}
              onChange={(e) => {
                setProjectWidth(Number(e.target.value));
              }}
              className="outline-solid outline outline-blue-500"
            ></input>
          </div>
          <div className="flex gap-2 mb-2">
            <label className="text-lg font-medium " htmlFor="ProjectHeight">
              Project Height (up-down inches):
            </label>
            <input
              type="number"
              id="ProjectHeight"
              name="ProjectHeight"
              min="1"
              value={projectHeight}
              onChange={(e) => {
                setProjectHeight(Number(e.target.value));
              }}
              className="outline-solid outline outline-blue-500"
            ></input>
          </div>
        </div>
        {/**
         * Display the cell calculations based on user inputs
         */}
        <div className="sectionDivider">
          <div className="flex items-center justify-center">
            <div className="border-blue-500 border p-2">{`${numberOfCellsWide} cells wide ↔️ x ${numberOfCellsTall} cells high ↕️`}</div>
          </div>
        </div>

        <div className="sectionDivider">
          <div className="flex">
            <div className="flex flex-col">
              <h2 className="text-lg font-medium mb-2">Color Selection</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {colorsEnum.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-md ${
                      currentColor === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-medium mb-2">
                Custom Color Selection
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-8 h-8 rounded-md"
                  // className={`w-8 h-8 rounded-md ${
                  //   currentColor === color
                  //     ? "ring-2 ring-offset-2 ring-black"
                  //     : ""
                  // }`}

                  aria-label="Choose custom color"
                />
                <button
                  onClick={addCustomColor}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Use This Color
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sectionDivider">
          <div className="flex items-center gap-3 mb-2">
            <div className="ml-4 flex items-center">
              <span className="mr-2">Current:</span>
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          </div>
        </div>
        {/**
         * Actual board with cells
         */}
        <div className="sectionDivider">
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
        </div>

        <div className="sectionDivider">
          {/**
           * Update the board with saved state
           */}
          <form
            className="flex gap-2"
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
              setCustomColor(JSONuserSavedBoardStateTEMP.customColor);
              setCurrentColor(JSONuserSavedBoardStateTEMP.cellColor);
            }}
          >
            <label className="text-lg font-medium" htmlFor="boardState">
              Saved board state:
            </label>
            <input
              type="text"
              id="boardState"
              name="boardState"
              value={userSavedBoardState}
              className="outline-solid outline outline-blue-500"
              onChange={(e) => {
                setUserSavedBoardState(e.target.value);
              }}
            ></input>

            <button
              className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
              type="submit"
              value="Submit"
            >
              Update the board
            </button>
          </form>
        </div>

        <div className="sectionDivider flex gap-2">
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
                  customColor,
                  cellColor: currentColor,
                })
              );
              console.log(boardStateToPrint);
              copyTextToClipboard(boardStateToPrint);
            }}
            type="button"
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
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
                  customColor,
                  cellColor: currentColor,
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
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
          >
            Download state to computer
          </button>
        </div>

        {/**
         * Cell painting options
         */}
        <div className="sectionDivider flex gap-2">
          <button
            onClick={(e) => handleColorAllCellsToOneColor(e)}
            type="button"
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
          >
            Click to color all cells
          </button>

          <button
            onClick={(e) =>
              setBoard((state) =>
                initalBoardState(
                  numberOfCellsWide,
                  numberOfCellsTall,
                  "#FFFFFF"
                )
              )
            }
            type="button"
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
          >
            Click to reset all cells
          </button>
        </div>
      </div>
    </>
  );
}
