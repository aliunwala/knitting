"use client";
import React, { useState, useCallback, memo, useRef } from "react";

// Individual cell component - memoized to prevent unnecessary rerenders
const Cell = memo(
  ({ color, onMouseDown, onMouseEnter, onMouseUp, id }: any) => {
    return (
      <div
        className="w-5 h-5 border border-gray-200"
        style={{ backgroundColor: color || "#f3f4f6" }}
        onMouseDown={() => onMouseDown(id)}
        onMouseEnter={() => onMouseEnter(id)}
        onMouseUp={() => onMouseUp()}
        onTouchStart={() => onMouseDown(id)}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const element = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (element && element instanceof HTMLElement) {
            if (element.dataset.id) {
              onMouseEnter(parseInt(element.dataset.id));
            }
          }
        }}
        onTouchEnd={() => onMouseUp()}
        data-id={id}
      />
    );
  }
);

// Grid component
const Grid = () => {
  // Configuration
  const ROWS = 10;
  const COLS = 10;

  // Default color options
  const defaultColors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#000000", // black
    "#ffffff", // white
  ];

  // Use a Map to store colors for each cell
  const [cellColors, setCellColors] = useState(new Map());
  // Current selected color
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  // Custom color input
  const [customColor, setCustomColor] = useState("#000000");
  // Tracking if mouse is pressed
  const isDrawingRef = useRef(false);
  // Tracking if we're in erase mode
  const isErasingRef = useRef(false);

  // Handle mouse down on a cell
  const handleMouseDown = useCallback(
    (id: any) => {
      isDrawingRef.current = true;
      // Check if the cell already has this color to determine if we're erasing
      isErasingRef.current = cellColors.get(id) === currentColor;

      setCellColors((prev) => {
        const newMap = new Map(prev);
        if (isErasingRef.current) {
          newMap.delete(id);
        } else {
          newMap.set(id, currentColor);
        }
        return newMap;
      });
    },
    [cellColors, currentColor]
  );

  // Handle mouse enter on a cell (for dragging)
  const handleMouseEnter = useCallback(
    (id: any) => {
      if (!isDrawingRef.current) return;

      setCellColors((prev) => {
        const newMap = new Map(prev);
        if (isErasingRef.current) {
          newMap.delete(id);
        } else {
          newMap.set(id, currentColor);
        }
        return newMap;
      });
    },
    [currentColor]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  // Create a flat array of cell IDs for rendering
  const cellIds = Array.from({ length: ROWS * COLS }, (_, index) => index);

  // Handle custom color change
  const handleCustomColorChange = (e: any) => {
    setCustomColor(e.target.value);
  };

  // Add custom color to palette
  const addCustomColor = () => {
    setCurrentColor(customColor);
  };

  // Clear all cells
  const clearGrid = () => {
    setCellColors(new Map());
  };

  // Handle mouse up on the entire document
  React.useEffect(() => {
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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interactive Color Grid</h1>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Color Selection</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {defaultColors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-md ${
                currentColor === color ? "ring-2 ring-offset-2 ring-black" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 mb-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-8 h-8"
            aria-label="Choose custom color"
          />
          <button
            onClick={addCustomColor}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Use This Color
          </button>

          <div className="ml-4 flex items-center">
            <span className="mr-2">Current:</span>
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
          </div>
        </div>

        <button
          onClick={clearGrid}
          className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
        >
          Clear Grid
        </button>
      </div>

      <div
        className="grid gap-px border border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          width: "fit-content",
        }}
        onMouseLeave={handleMouseUp}
      >
        {cellIds.map((id) => (
          <Cell
            key={id}
            id={id}
            color={cellColors.get(id)}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        ))}
      </div>

      <div className="mt-4">
        <p className="mb-2">Colored cells: {cellColors.size}</p>
        <p className="text-sm text-gray-600">
          Click and drag to draw. Click cells with the same color to erase.
        </p>
      </div>
    </div>
  );
};

// App component
const Test1 = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Grid />
    </div>
  );
};

export default Test1;
