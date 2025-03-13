"use client";
// import { on } from "events";
import Cell from "./cell";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  copyTextToClipboard,
  downloadText,
  initalBoardState,
  modify2DArray,
  cellDimensions,
  isInRange,
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
   * State & Derived State & refs
   */
  const [stichesPerInch, setStichesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(10);
  const [projectWidth, setProjectWidth] = useState(1);
  const [projectHeight, setProjectHeight] = useState(1);
  const [activeRow, setActiveRow] = useState(1);
  const [knittingMode, setKnittingMode] = useState(false);
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
  // Tracking if mouse is pressed
  const isDrawingRef = useRef(false);
  // Tracking if we're in erase mode
  const isErasingRef = useRef(false);
  const [board, setBoard] = useState(
    initalBoardState(numberOfCellsWide, numberOfCellsTall)
  );

  /**
   * Effects
   */
  useEffect(() => {
    if (board && board[0]) {
      if (
        board.length !== numberOfCellsTall ||
        board[0].length !== numberOfCellsWide
      ) {
        console.log("Setting initial board state");
        setBoard((state) =>
          initalBoardState(
            isInRange(numberOfCellsWide, 1, 300),
            isInRange(numberOfCellsTall, 1, 300)
          )
        );
      }
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

  // Handle mouse down on a cell
  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      isDrawingRef.current = true;
      // Check if the cell already has this color to determine if we're erasing
      isErasingRef.current = board[row][col].color === currentColor;

      if (isErasingRef.current) {
        const newCell = { color: "#FFFFFF" };
        setBoard((state) => modify2DArray(state, row, col, newCell));
      } else {
        const newCell = { color: currentColor };
        setBoard((state) => modify2DArray(state, row, col, newCell));
      }
    },
    [currentColor, board]
  );

  // Handle mouse enter on a cell (for dragging)
  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isDrawingRef.current) return;

      if (isErasingRef.current) {
        const newCell = { color: "#FFFFFF" };
        setBoard((state) => modify2DArray(state, row, col, newCell));
      } else {
        const newCell = { color: currentColor };
        setBoard((state) => modify2DArray(state, row, col, newCell));
      }
    },
    [currentColor]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  // Handle mouse up on the entire document
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDrawingRef.current = false;
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Knitting Helper</h1>

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
                setStichesPerInch(isInRange(Number(e.target.value), 1, 25));
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
                setRowsPerInch(isInRange(Number(e.target.value), 1, 25));
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
              min={1}
              max={25}
              value={projectWidth}
              onChange={(e) =>
                setProjectWidth(isInRange(Number(e.target.value), 1, 25))
              }
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
              min={1}
              max={25}
              value={projectHeight}
              onChange={(e) =>
                setProjectHeight(isInRange(Number(e.target.value), 1, 25))
              }
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
          <div className="flex gap-12">
            <div className="flex flex-col bg-gray-300 ">
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

            <div className="flex flex-col  bg-gray-300 ">
              <h2 className="text-lg font-medium mb-2">
                Custom Color Selection
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-8 h-8 rounded-md"
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
        {/**
         * Cell painting options
         */}
        <div className="sectionDivider flex gap-2">
          <button
            onClick={(e) => {
              if (
                confirm(
                  `Are you sure you want to color all the cells to ${currentColor}? this cannot be undone.`
                )
              ) {
                handleColorAllCellsToOneColor(e);
              }
            }}
            type="button"
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
          >
            Click to color all cells
          </button>

          <button
            onClick={(e) => {
              if (
                confirm(
                  `Are you sure you want to reset the cells to all be white? this cannot be undone.`
                )
              ) {
                setBoard((state) =>
                  initalBoardState(
                    numberOfCellsWide,
                    numberOfCellsTall,
                    "#FFFFFF"
                  )
                );
              }
            }}
            type="button"
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
          >
            Click to reset all cells
          </button>
        </div>

        <div className="sectionDivider">
          <div className="flex items-center gap-3 mb-2">
            <div className="ml-4 flex items-center">
              <span className="mr-2">
                <h2 className="text-2xl font-medium">
                  Currently selected color:
                </h2>
              </span>
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
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                activeRow={activeRow}
                knittingMode={knittingMode}
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
          <button
            onClick={(e) => {
              setKnittingMode((s) => !s);
            }}
            type="button"
            className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
          >
            Click to toggle knitting mode
          </button>

          <label
            className="text-lg font-medium "
            htmlFor="knittingModeActiveRow"
          >
            Active Row:
          </label>
          <input
            type="number"
            id="knittingModeActiveRow"
            name="knittingModeActiveRow"
            value={activeRow}
            onChange={(e) => {
              setActiveRow(
                isInRange(Number(e.target.value), 1, numberOfCellsTall)
              );
            }}
            className="outline-solid outline outline-blue-500"
          ></input>
        </div>
        <div className="sectionDivider">
          <h2>
            To quckly erase cells, click on a with the same color you have
            selected, then drag the cursor.
          </h2>
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
      </div>
    </>
  );
}
