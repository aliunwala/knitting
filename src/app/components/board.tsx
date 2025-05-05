"use client";
// import { on } from "events";
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
import BoardBorderTopBottom from "./boardBorderTopBottom";
import BoardBorderSide from "./boardBorderSide";
import BoardCenter from "./boardCenter";
import QuickActionButton from "./quickActionButton";
import LabeledInput from "./labeledInput";
import BoardParamsForm from "./boardParamsForm";
import { z } from "zod";
import { formSchemaBoardParams } from "@/app/components/boardParamsForm";
import { Button } from "@/components/ui/button";
import { TupleKeyDictionary } from "../utils/tupleKeyDictionary";
import {
  addBoard,
  getBoards,
  getRandomBoard,
  updateBoard,
} from "./../lib/data";

export default function Board() {
  /**
   * Constants
   */
  const colorsEnum = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
  ];
  const defaultCellWidth = 34;
  const defaultCellHeight = 34;

  let inputDefaults = {
    stichesPerInch: 3,
    rowsPerInch: 3,
    projectWidth: 3,
    projectHeight: 3,
  };
  /**
   * State & Derived State & refs
   */
  // User inputs for grid
  const [boardParamsFormState, setBoardParamsFormState] =
    useState(inputDefaults);

  const [colorMap, setColorMap] = useState(new TupleKeyDictionary<string>());
  // User inputs for knitting mode
  const [activeRow, setActiveRow] = useState(1);
  const [knittingMode, setKnittingMode] = useState(false);

  // Custom colors
  const [customColor, setCustomColor] = useState(getRandomHexColor());
  const [customColorList, setCustomColorList] = useState<string[]>(colorsEnum);

  // Currently selected color
  const [currentColor, setCurrentColor] = useState(colorsEnum[0]);

  // Saved states to reset app to:
  // 1) User uploads previously saved state
  const [userSavedBoardState, setUserSavedBoardState] = useState("");
  // 2) User presses the Undo button to jump back to a previous state
  const [automaticallySavedBoardState, setAutomaticallySavedBoardState] =
    useState<object[]>([]);

  /**
   * Derived state:
   */
  const numberOfCellsWide =
    boardParamsFormState.stichesPerInch * boardParamsFormState.projectWidth;
  const numberOfCellsTall =
    boardParamsFormState.rowsPerInch * boardParamsFormState.projectHeight;

  const { cellHeight, cellWidth } = cellDimensions(
    boardParamsFormState.projectWidth,
    boardParamsFormState.projectHeight,
    numberOfCellsWide,
    numberOfCellsTall,
    defaultCellWidth,
    defaultCellHeight
  );

  // Tracking if mouse is pressed
  const isDrawingRef = useRef(false);
  // Tracking if we're in erase mode
  const isErasingRef = useRef(false);
  // const [board, setBoard] = useState(
  //   initalBoardState(numberOfCellsWide, numberOfCellsTall)
  // );
  let board = initalBoardState(numberOfCellsWide, numberOfCellsTall);

  /**
   * Loads a state onto the page
   */
  function loadSavedState(state: any) {
    inputDefaults = {
      stichesPerInch: state.boardParamsFormState.stichesPerInch,
      rowsPerInch: state.boardParamsFormState.rowsPerInch,
      projectWidth: state.boardParamsFormState.projectHeight,
      projectHeight: state.boardParamsFormState.projectWidth,
    };

    setBoardParamsFormState({
      stichesPerInch: state.boardParamsFormState.stichesPerInch,
      rowsPerInch: state.boardParamsFormState.rowsPerInch,
      projectWidth: state.boardParamsFormState.projectHeight,
      projectHeight: state.boardParamsFormState.projectWidth,
    });
    board = state.board;
    setColorMap(TupleKeyDictionary.fromJSON(state.colorMap));
    // setBoard(state.board);
    setCustomColor(state.customColor);
    setCurrentColor(state.cellColor);
    setCustomColorList(state.customColorList);
  }

  /**
   * Creates a state from the current page
   */
  const createSavedState = useCallback(
    function createSavedState() {
      return {
        board,
        boardParamsFormState,
        customColor,
        cellColor: currentColor,
        customColorList,
        colorMap: colorMap.toJSONString(),
      };
    },
    [
      board,
      boardParamsFormState,
      customColor,
      currentColor,
      customColorList,
      colorMap,
    ]
  );

  /**
   * HANDLERS
   */

  /**
   * Colors the right row when in knitting mode
   */
  function handleActiveRow(e: ChangeEvent<HTMLInputElement>) {
    setActiveRow(isInRange(Number(e.target.value), 1, numberOfCellsTall));
  }

  /**
   * Colors a cell when clicked
   */
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setColorMap((state) => {
        return state.getCopyWithNewItem([row, col], currentColor);
      });
    },
    [currentColor]
  );

  /**
   * Sets all cells to the currentColor
   */
  function handleColorAllCellsToOneColor(e: any) {
    const floodFillDict = new TupleKeyDictionary<string>();
    board.forEach((value, row) => {
      board[0].forEach((value, col) => {
        floodFillDict.set([row, col], currentColor);
      });
    });
    setColorMap((s) => floodFillDict);
  }

  /**
   * Sets all cells to white
   */
  function handleColorAllCellsToWhite(e: any) {
    setColorMap(new TupleKeyDictionary<string>());
  }

  /**
   * Removes all colors from the palette
   */
  function handleCustomColorsListReset(e: any) {
    // setFillColor(e.target.value);
    setCustomColorList([]);
    setCustomColor("#FFFFFF");
    setCurrentColor("#FFFFFF");
  }

  /**
   * Removes one color from the palette
   */
  function handleDeleteCustomColor() {
    if (customColorList.length >= 2) {
      // Set current color to first non-current color
      let colorVal = "#FFFFFF";
      for (let i = 0; i < customColorList.length; i++) {
        const value = customColorList[i];
        if (value != currentColor) {
          colorVal = value;
          break;
        }
      }
      setCurrentColor(colorVal);
    }
    if (customColorList.length >= 1) {
      // Need atleast 1 color to delete
      setCustomColorList(
        customColorList.filter((value) => value != currentColor)
      );
    }
  }

  /**
   * Undos back to the last mouse-down event
   */
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

  /**
   * Sets the activeColor on the palette
   */
  const handleCustomColorChange = (e: any) => {
    setCustomColor(e.target.value);
  };

  /**
   * Adds one color to the palette
   */

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

  /**
   * Handles mousedown events on a cell, decides if we are drawing or erasing and saves a board state.
   * Then colors the cell white or the currentColor
   */
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
        setColorMap((prevState) => {
          return prevState.getCopyWithNewItem([row, col], "#FFFFFF");
        });
      } else {
        setColorMap((prevState) => {
          return prevState.getCopyWithNewItem([row, col], currentColor);
        });
      }
    },
    [currentColor, board, createSavedState]
  );

  /**
   * Handles mouseenter events on a cell, decides if we are drawing or erasing and
   * then colors the cell white or the currentColor
   */
  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isDrawingRef.current) return;

      if (isErasingRef.current) {
        setColorMap((prevState) => {
          return prevState.getCopyWithNewItem([row, col], "#FFFFFF");
        });
      } else {
        setColorMap((prevState) => {
          return prevState.getCopyWithNewItem([row, col], currentColor);
        });
      }
    },
    [currentColor]
  );

  /**
   * Handles mouseup events on a cell
   */
  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  /**
   * Handles mouseup/touchend events for the whole document as well as a bug around handleDragStart
   */
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
      {/* <form
        action={() => console.log(addBoard(JSON.stringify(createSavedState())))}
      >
        <input type="submit" value={"addBoard"}></input>
      </form> */}

      {/* <form
        action={async () => {
          // const x = await getBoards();
          // console.log(x[0].board);
          const x = await getRandomBoard();
          loadSavedState(JSON.parse(x[0].board));
        }}
      >
        <input type="submit" value={"LoadBoard"}></input>
      </form> */}

      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4">Knitting Helper</h1>

        {/* <section className="sectionDivider"> */}
        <h2 className="text-2xl font-bold mb-4">User settings</h2>

        <div className="mb-12">
          <BoardParamsForm
            defaultValues={inputDefaults}
            onSubmit={(values: z.infer<typeof formSchemaBoardParams>) => {
              setBoardParamsFormState((s) => values);
            }}
          ></BoardParamsForm>
          <div className="mb-6"></div>
          <div className="">{`With the current settings your board  will be: ${numberOfCellsWide} cells wide ↔️ x ${numberOfCellsTall} cells high ↕️`}</div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Board</h2>

        <section className="sectionDivider">
          <div className="flex gap-12">
            <div className=" flex flex-col items-center">
              <span className="mr-2">
                <p className="text-lg font-medium mb-2">Selected color:</p>
              </span>
              <div
                className="w-12 h-12 rounded border border-gray-300 ring-2 ring-offset-2 ring-black"
                style={{ backgroundColor: currentColor }}
              ></div>
            </div>

            <div className="flex flex-col  flex-wrap max-w-[152px]">
              <h2 className="text-lg font-medium mb-2">Avaliable Colors:</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {customColorList.map((color, index) => {
                  const tempButton = (
                    <Button
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
              <h2 className="text-lg font-medium mb-2">Additional settings:</h2>

              <div className="flex    gap-2">
                <h2 className="text-lg font-medium mb-2">Custom color:</h2>
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-16 h-16 rounded-md min-w-[30px] min-h-[30px]"
                  aria-label="Choose custom color"
                ></input>
                <QuickActionButton onClickHandler={handleAddCustomColor}>
                  Add color
                </QuickActionButton>
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
                  <p>Delete selected color:</p>
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
            Color all cells
          </QuickActionButton>
          <QuickActionButton
            needsConfirmation={true}
            confirmText={`Are you sure you want to reset the cells to all be white? this cannot be undone.`}
            onClickHandler={handleColorAllCellsToWhite}
          >
            Reset all cells
          </QuickActionButton>
          <QuickActionButton
            needsConfirmation={false}
            onClickHandler={handleUndo}
          >
            Undo
          </QuickActionButton>
        </section>

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
                colorMap={colorMap}
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
                colorMap={colorMap}
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
          <div className="flex items-end gap-4">
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
          <h2 className="text-2xl font-bold mb-4">Tips</h2>
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
        <h2 className="text-2xl font-bold mb-4">Save and reload your work</h2>

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
            <div className="flex items-end gap-2">
              <LabeledInput
                value={userSavedBoardState}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUserSavedBoardState(e.target.value);
                }}
                id="boardState"
                type="text"
                labelText={"Saved board state:"}
              ></LabeledInput>
              <Button type="submit" value="Submit">
                Update the board
              </Button>
            </div>
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
