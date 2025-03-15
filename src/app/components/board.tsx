"use client";
// import { on } from "events";
import Cell from "./cell";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  copyTextToClipboard,
  downloadText,
  initalBoardState,
  modify2DArray,
  cellDimensions,
  isInRange,
  getRandomHexColor,
} from "../utils/helperFunctions";
import ColorSelect from "./select";
import BoardBorderTopBottom from "./boardBorderTopBottom";
import BoardBorderSide from "./boardBorderSide";
import BoardCenter from "./boardCenter";
import QuickActionButton from "./quickActionButton";
import LabeledInput from "./labeledInput";
import { Plus } from "lucide-react";

export default function Board() {
  /**
   * Constants
   */
  const colorsEnum = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    // "#8b5cf6", // purple
    // "#ec4899", // pink
    // "#000000", // black
    // "#ffffff", // white
  ];
  const defaultCellWidth = 34;
  const defaultCellHeight = 34;

  /**
   * State & Derived State & refs
   */
  const [stichesPerInch, setStichesPerInch] = useState(5);
  const [rowsPerInch, setRowsPerInch] = useState(10);
  const [projectWidth, setProjectWidth] = useState(3);
  const [projectHeight, setProjectHeight] = useState(3);
  const [activeRow, setActiveRow] = useState(1);
  const [knittingMode, setKnittingMode] = useState(false);
  // Custom color input
  const [customColor, setCustomColor] = useState(getRandomHexColor());
  const [customColorList, setCustomColorList] = useState<string[]>(colorsEnum);
  // const [fillColor, setFillColor] = useState(colorsEnum[0]);
  const [currentColor, setCurrentColor] = useState(colorsEnum[0]);
  const [userSavedBoardState, setUserSavedBoardState] = useState("");
  const [automaticallySavedBoardState, setAutomaticallySavedBoardState] =
    useState<object[]>([]);
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
    console.log(automaticallySavedBoardState.length);
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
  }, [
    numberOfCellsWide,
    numberOfCellsTall,
    automaticallySavedBoardState,
    board,
  ]);
  /**
   * Util functions that use state
   */
  function loadSavedState(state: any) {
    setStichesPerInch(state.stichesPerInch);
    setRowsPerInch(state.rowsPerInch);
    setProjectHeight(state.projectHeight);
    setProjectWidth(state.projectWidth);
    setBoard(state.board);
    setCustomColor(state.customColor);
    setCurrentColor(state.cellColor);
    setCustomColorList(state.customColorList);
  }

  const createSavedState = useCallback(
    function createSavedState() {
      return {
        board,
        stichesPerInch,
        rowsPerInch,
        projectHeight,
        projectWidth,
        customColor,
        cellColor: currentColor,
        customColorList,
      };
    },
    [
      board,
      stichesPerInch,
      rowsPerInch,
      projectHeight,
      projectWidth,
      customColor,
      currentColor,
      customColorList,
    ]
  );
  /**
   * Handlers
   */
  function handleActiveRow(e: ChangeEvent<HTMLInputElement>) {
    setActiveRow(isInRange(Number(e.target.value), 1, numberOfCellsTall));
  }

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
  function handleColorAllCellsToWhite(e: any) {
    // setFillColor(e.target.value);
    setBoard((state) =>
      initalBoardState(numberOfCellsWide, numberOfCellsTall, "#FFFFFF")
    );
  }
  function handleCustomColorsListReset(e: any) {
    // setFillColor(e.target.value);
    setCustomColorList([]);
    setCustomColor("#FFFFFF");
    setCurrentColor("#FFFFFF");
  }
  function handleDeleteCustomColor() {
    if (customColorList.length >= 2) {
      // Set current color to next color
      setCurrentColor(customColorList[1]);
    }
    if (customColorList.length >= 1) {
      // Need atleast 1 color to delete
      setCustomColorList(
        customColorList.filter((value) => value != currentColor)
      );
    }
  }
  function handleUndo(e: any) {
    let JSONuserSavedBoardStateTEMP: any;
    try {
      const JSONuserSavedBoardState = automaticallySavedBoardState.pop();
      if (JSONuserSavedBoardState === undefined) {
        // We popped nothing
        return;
      }
      loadSavedState(JSONuserSavedBoardState);
    } catch (e) {
      console.log("Error when updating board state: " + e);
    }
  }
  const handleCustomColorChange = (e: any) => {
    setCustomColor(e.target.value);
  };
  // Add custom color to palette
  const handleAddCustomColor = () => {
    setCurrentColor(customColor);
    setCustomColor(getRandomHexColor());
    setCustomColorList((prevColors) => {
      if (prevColors.length <= 19) {
        return [customColor, ...prevColors];
      } else {
        return [customColor, ...prevColors.slice(0, -1)];
      }
    });
  };

  // Handle mouse down on a cell
  const handleMouseDown = useCallback(
    (e: Event, row: number, col: number) => {
      e.preventDefault();
      isDrawingRef.current = true;
      // Check if the cell already has this color to determine if we're erasing
      isErasingRef.current = board[row][col].color === currentColor;

      setAutomaticallySavedBoardState((state) => {
        if (state.length >= 10) {
          return [...state.slice(1), createSavedState()];
        } else {
          return [...state, createSavedState()];
        }
      });
      if (isErasingRef.current) {
        const newCell = { color: "#FFFFFF" };
        setBoard((state) => modify2DArray(state, row, col, newCell));
      } else {
        const newCell = { color: currentColor };
        setBoard((state) => modify2DArray(state, row, col, newCell));
      }
    },
    [currentColor, board, createSavedState]
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

    const handleDragStart = (e: Event) => {
      e.preventDefault();
    };

    // Had to add this for bug: Chrome on Mac creating a globe icon on dragstart events
    document.addEventListener("dragstart", handleDragStart);

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("dragstart", handleGlobalMouseUp);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Knitting Helper</h1>

        {/**
         * User inputs
         */}
        <section className="sectionDivider">
          {/* <h2>User Settings:</h2> */}
          <div className="flex gap-2 mb-2">
            <LabeledInput
              value={stichesPerInch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setStichesPerInch(isInRange(Number(e.target.value), 1, 25));
              }}
              id="StitchesPerInch"
              type="number"
              labelText={"Sitches Per inch (left-right):"}
            ></LabeledInput>
          </div>
          <div className="flex gap-2 mb-2">
            <LabeledInput
              value={rowsPerInch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setRowsPerInch(isInRange(Number(e.target.value), 1, 25));
              }}
              id="RowsPerInch"
              type="number"
              labelText={"Rows Per inch (up-down):"}
            ></LabeledInput>
          </div>
        </section>

        <section className="sectionDivider">
          <div className="flex gap-2 mb-2">
            <LabeledInput
              value={projectWidth}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProjectWidth(isInRange(Number(e.target.value), 1, 25));
              }}
              id="ProjectWidth"
              type="number"
              labelText={"Project Width (left-right inches):"}
            ></LabeledInput>
          </div>
          <div className="flex gap-2 mb-2">
            <LabeledInput
              value={projectHeight}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProjectHeight(isInRange(Number(e.target.value), 1, 25));
              }}
              id="ProjectHeight"
              type="number"
              labelText={"Project Height (up-down inches): "}
            ></LabeledInput>
          </div>
        </section>
        {/**
         * Display the cell calculations based on user inputs
         */}
        <section className="sectionDivider">
          <div className="">{`Using that data your board will be: ${numberOfCellsWide} cells wide ↔️ x ${numberOfCellsTall} cells high ↕️`}</div>
        </section>

        <section className="sectionDivider">
          <div className="flex gap-12">
            <div className="bg-gray-300 flex flex-col items-center">
              <span className="mr-2">
                <p className="text-lg font-medium mb-2">Current color:</p>
              </span>
              <div
                className="w-12 h-12 rounded border border-gray-300 ring-2 ring-offset-2 ring-black"
                style={{ backgroundColor: currentColor }}
              ></div>
            </div>

            <div className="flex flex-col bg-gray-300 flex-wrap max-w-[184px]">
              <h2 className="text-lg font-medium mb-2">Colors:</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {customColorList.map((color, index) => {
                  const tempButton = (
                    <button
                      title={color}
                      key={index + "_" + color}
                      className={`w-8 h-8 rounded-md ${
                        currentColor === color
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                      aria-label={`Select ${color} color`}
                    />
                  );
                  return (
                    <div key={index + "_DIV" + color} className="basis-1/5 ">
                      {tempButton}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col  gap-4">
              <div className="flex   bg-gray-300 gap-2">
                <h2 className="text-lg font-medium mb-2">Select color:</h2>
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-16 h-8 rounded-md"
                  aria-label="Choose custom color"
                ></input>
                <button
                  onClick={handleAddCustomColor}
                  className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded "
                >
                  Add color
                </button>
              </div>
              <QuickActionButton
                needsConfirmation={true}
                confirmText={`Are you sure you want to reset the previously used colors? this cannot be undone`}
                onClickHandler={handleCustomColorsListReset}
              >
                Delete all colors
              </QuickActionButton>
              <QuickActionButton
                needsConfirmation={false}
                onClickHandler={handleDeleteCustomColor}
              >
                <div className="flex items-center gap-2">
                  <p>Delete current color:</p>
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: currentColor }}
                  ></div>
                </div>
              </QuickActionButton>
            </div>
          </div>
        </section>
        {/**
         * Cell painting options
         */}
        <section className="sectionDivider flex gap-2">
          <QuickActionButton
            needsConfirmation={true}
            confirmText={`Are you sure you want to color all the cells to ${currentColor}? this cannot be undone.`}
            onClickHandler={handleColorAllCellsToOneColor}
          >
            Click to color all cells
          </QuickActionButton>
          <QuickActionButton
            needsConfirmation={true}
            confirmText={`Are you sure you want to reset the cells to all be white? this cannot be undone.`}
            onClickHandler={handleColorAllCellsToWhite}
          >
            Click to reset all cells
          </QuickActionButton>
          <QuickActionButton
            needsConfirmation={false}
            onClickHandler={handleUndo}
          >
            Undo
          </QuickActionButton>
        </section>

        {/* <section className="sectionDivider">
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
        </section> */}
        {/**
         * Actual board with cells
         */}
        <section className="sectionDivider">
          <h2>Standard Board</h2>

          <BoardBorderTopBottom
            numberOfCellsWide={numberOfCellsWide}
            cellWidth={cellWidth}
            defaultCellHeight={defaultCellHeight}
            reflect={false}
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
                reflect={false}
              ></BoardCenter>
            </div>
            <div>
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
            reflect={false}
          ></BoardBorderTopBottom>
        </section>

        {/**
         * Reflected board with cells
         */}
        <section className="sectionDivider">
          <h2>Reflected Board</h2>
          <BoardBorderTopBottom
            numberOfCellsWide={numberOfCellsWide}
            cellWidth={cellWidth}
            defaultCellHeight={defaultCellHeight}
            reflect={true}
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
                reflect={true}
              ></BoardCenter>
            </div>
            <div>
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
            reflect={true}
          ></BoardBorderTopBottom>
        </section>

        <section className="sectionDivider">
          <div className="flex items-center gap-4">
            <QuickActionButton
              needsConfirmation={false}
              onClickHandler={() => setKnittingMode((s) => !s)}
            >
              Click to toggle knitting mode
            </QuickActionButton>

            <LabeledInput
              value={activeRow}
              onChange={handleActiveRow}
              id="knittingModeActiveRow"
              type="number"
              labelText={"Active Row: "}
            ></LabeledInput>
          </div>
        </section>
        <section className="sectionDivider">
          <h2>Tips:</h2>

          <ul className="list-disc list-inside">
            <li>
              To quckly erase cells, click on a with the same color you have
              selected, then drag the cursor.
            </li>
            <li>
              In knitting mode use the arrow keys to move the active row up and
              down
            </li>
          </ul>
        </section>

        <section className="sectionDivider">
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
                loadSavedState(JSONuserSavedBoardState);
              } catch (e) {
                console.log("Error when updating board state: " + e);
              }
            }}
          >
            <LabeledInput
              value={userSavedBoardState}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUserSavedBoardState(e.target.value);
              }}
              id="boardState"
              type="text"
              labelText={"Saved board state:"}
            ></LabeledInput>
            <button
              className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
              type="submit"
              value="Submit"
            >
              Update the board
            </button>
          </form>
        </section>

        <section className="sectionDivider flex gap-2">
          {/**
           * Copy state to clipboard
           */}
          <QuickActionButton
            needsConfirmation={false}
            onClickHandler={() => {
              const boardStateToPrint = JSON.stringify(createSavedState());
              copyTextToClipboard(boardStateToPrint);
            }}
          >
            Copy state to clipboard
          </QuickActionButton>
          {/**
           * Download state to file
           */}
          <QuickActionButton
            needsConfirmation={false}
            onClickHandler={() => {
              const boardStateToPrint = JSON.stringify(createSavedState());
              copyTextToClipboard(boardStateToPrint);
              downloadText(
                boardStateToPrint,
                `boardState${String(new Date().toISOString())}.txt`
              );
            }}
          >
            Download state to computer
          </QuickActionButton>
        </section>
      </div>
    </>
  );
}
