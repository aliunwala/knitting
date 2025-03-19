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
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "./formInput";
import BoardParamsForm, { inputDefaults } from "./boardParamsForm";
import { z } from "zod";
import { formSchemaBoardParams } from "@/app/components/boardParamsForm";
import { Button } from "@/components/ui/button";

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
  // User inputs for grid
  // const [stichesPerInch, setStichesPerInch] = useState(5);
  // const [rowsPerInch, setRowsPerInch] = useState(10);
  // const [projectWidth, setProjectWidth] = useState(3);
  // const [projectHeight, setProjectHeight] = useState(3);

  const [boardParamsFormState, setBoardParamsFormState] =
    useState(inputDefaults);

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

  // Need to change this to only update onSubmit
  const numberOfCellsWide =
    boardParamsFormState.stichesPerInch * boardParamsFormState.projectWidth;
  const numberOfCellsTall =
    boardParamsFormState.rowsPerInch * boardParamsFormState.projectHeight;
  //  numberOfCellsWide; // = stichesPerInch * projectWidth;
  // let numberOfCellsTall; // = rowsPerInch * projectHeight;

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
  const [board, setBoard] = useState(
    initalBoardState(numberOfCellsWide, numberOfCellsTall)
  );

  /**
   * Hooks
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
    setBoardParamsFormState({
      stichesPerInch: state.boardParamsFormState.stichesPerInch,
      rowsPerInch: state.boardParamsFormState.rowsPerInch,
      projectWidth: state.boardParamsFormState.projectHeight,
      projectHeight: state.boardParamsFormState.projectWidth,
    });
    // setStichesPerInch(state.stichesPerInch);
    // setRowsPerInch(state.rowsPerInch);
    // setProjectHeight(state.projectHeight);
    // setProjectWidth(state.projectWidth);
    setBoard(state.board);
    setCustomColor(state.customColor);
    setCurrentColor(state.cellColor);
    setCustomColorList(state.customColorList);
  }

  const createSavedState = useCallback(
    function createSavedState() {
      return {
        board,
        // stichesPerInch,
        // rowsPerInch,
        // projectHeight,
        // projectWidth,
        boardParamsFormState,
        customColor,
        cellColor: currentColor,
        customColorList,
      };
    },
    [
      board,
      // stichesPerInch,
      // rowsPerInch,
      // projectHeight,
      // projectWidth,
      boardParamsFormState,
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

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   control,
  //   formState: { errors },
  // } = useForm<FormValues>();
  // const onSubmit = handleSubmit((data) => console.log(data));
  // type FormValues = {
  //   FirstName: string;
  // };

  return (
    <>
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4">Knitting Helper</h1>

        {/* <section className="sectionDivider"> */}
        <h2 className="text-2xl font-bold mb-4">User settings</h2>

        <div className="mb-12">
          <BoardParamsForm
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
                <QuickActionButton
                  onClickHandler={handleAddCustomColor}
                  // className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded "
                >
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
            {/* <QuickActionButton
            needsConfirmation={false}
            type="submit"
    
            >

            </QuickActionButton> */}
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
