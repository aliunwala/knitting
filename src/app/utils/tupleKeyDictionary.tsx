/**
 * A generic dictionary class that allows tuples of two integers to be used as keys.
 * @template T The type of values stored in the dictionary.
 */
export class TupleKeyDictionary<T> {
  private items: Map<string, T> = new Map<string, T>();

  /**
   * Creates a string key from a tuple of two integers.
   * @param key The tuple key [number, number]
   * @returns A string representation of the tuple
   */
  private getKeyString(key: [number, number]): string {
    return `${key[0]},${key[1]}`;
  }

  /**
   * Converts a string key back to a tuple.
   * @param keyString The string representation of a tuple
   * @returns The tuple [number, number]
   */
  private getKeyTuple(keyString: string): [number, number] {
    const [x, y] = keyString.split(",").map(Number);
    return [x, y];
  }

  /**
   * Sets a value in the dictionary using a tuple key.
   * @param key The tuple key [number, number]
   * @param value The value to store
   */
  set(key: [number, number], value: T): void {
    const keyString = this.getKeyString(key);
    this.items.set(keyString, value);
  }

  /**
   * Gets a value from the dictionary using a tuple key.
   * @param key The tuple key [number, number]
   * @returns The stored value or undefined if not found
   */
  get(key: [number, number]): T | undefined {
    const keyString = this.getKeyString(key);
    return this.items.get(keyString);
  }

  /**
   * Checks if a key exists in the dictionary.
   * @param key The tuple key [number, number]
   * @returns True if the key exists, false otherwise
   */
  has(key: [number, number]): boolean {
    const keyString = this.getKeyString(key);
    return this.items.has(keyString);
  }

  /**
   * Removes a key-value pair from the dictionary.
   * @param key The tuple key [number, number]
   * @returns True if the key was found and removed, false otherwise
   */
  delete(key: [number, number]): boolean {
    const keyString = this.getKeyString(key);
    return this.items.delete(keyString);
  }

  /**
   * Gets the number of key-value pairs in the dictionary.
   * @returns The number of entries
   */
  size(): number {
    return this.items.size;
  }

  /**
   * Removes all key-value pairs from the dictionary.
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * Returns all keys in the dictionary.
   * @returns An array of tuple keys
   */
  keys(): [number, number][] {
    return Array.from(this.items.keys()).map((keyString) =>
      this.getKeyTuple(keyString)
    );
  }

  /**
   * Returns all values in the dictionary.
   * @returns An array of values
   */
  values(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Returns all entries in the dictionary as tuple-value pairs.
   * @returns An array of tuple-value entries
   */
  entries(): Array<[[number, number], T]> {
    return this.keys().map(
      (key) => [key, this.get(key)!] as [[number, number], T]
    );
  }

  /**
   * Gets the internal items Map.
   * WARNING: This returns a reference to the actual items. Modifying this Map
   * will directly affect the dictionary.
   * @returns The internal Map object
   */
  getItems(): Map<string, T> {
    return this.items;
  }

  /**
   * Creates a deep copy of the internal items Map.
   * @returns A new Map with the same entries as the original
   */
  getItemsCopy(): Map<string, T> {
    return new Map(this.items);
  }

  /**
   * Creates a copy of the dictionary, adds a new key-value pair to it,
   * and returns the copy.
   * @param key The tuple key [number, number] to add
   * @param value The value to add
   * @returns A new TupleKeyDictionary instance with all existing entries plus the new one
   */
  getCopyWithNewItem(key: [number, number], value: T): TupleKeyDictionary<T> {
    const copy = this.clone();
    copy.set(key, value);
    return copy;
  }

  /**
   * Creates a complete clone of this dictionary.
   * @returns A new TupleKeyDictionary instance with all the same entries
   */
  clone(): TupleKeyDictionary<T> {
    const newDict = new TupleKeyDictionary<T>();
    newDict.items = this.getItemsCopy();
    return newDict;
  }

  /**
   * Serializes the dictionary to a JSON string.
   * @returns A JSON string representation of the dictionary
   */
  toJSONString(): string {
    // Convert Map to array of [key, value] pairs for serialization
    const entriesArray = Array.from(this.items.entries()).map(
      ([keyString, value]) => {
        const key = this.getKeyTuple(keyString);
        return { key, value };
      }
    );

    return JSON.stringify({ entries: entriesArray });
  }

  /**
   * Serializes the dictionary to a JSON string.
   * @returns A JSON string representation of the dictionary
   */
  toJSON(): object {
    // Convert Map to array of [key, value] pairs for serialization
    const entriesArray = Array.from(this.items.entries()).map(
      ([keyString, value]) => {
        const key = this.getKeyTuple(keyString);
        return { key, value };
      }
    );

    return { entries: entriesArray };
  }

  /**
   * Loads the dictionary from a JSON string.
   * @param jsonString A JSON string representation of the dictionary
   * @throws Error if the JSON string is invalid
   */
  fromJSON(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString);

      // Clear existing items
      this.clear();

      // Check if the parsed JSON has the expected structure
      if (!parsed.entries || !Array.isArray(parsed.entries)) {
        throw new Error(
          "Invalid JSON format: missing or invalid 'entries' array"
        );
      }

      // Load entries into the dictionary
      for (const entry of parsed.entries) {
        if (
          !entry.key ||
          !Array.isArray(entry.key) ||
          entry.key.length !== 2 ||
          typeof entry.key[0] !== "number" ||
          typeof entry.key[1] !== "number"
        ) {
          throw new Error("Invalid key format in JSON");
        }

        const key: [number, number] = [entry.key[0], entry.key[1]];
        this.set(key, entry.value);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse JSON: ${error.message}`);
      } else {
        throw new Error("Failed to parse JSON: Unknown error");
      }
    }
  }

  /**
   * Creates a new TupleKeyDictionary from a JSON string.
   * @param jsonString A JSON string representation of a dictionary
   * @returns A new TupleKeyDictionary instance
   * @throws Error if the JSON string is invalid
   */
  static fromJSON<U>(jsonString: string): TupleKeyDictionary<U> {
    const dictionary = new TupleKeyDictionary<U>();
    dictionary.fromJSON(jsonString);
    return dictionary;
  }

  /**
   * Replaces all values that match a condition with a new value.
   * @param valueToMatch The value to search for, or a function to test values
   * @param newValue The replacement value, or a function to generate a new value
   * @returns The number of values that were replaced
   */
  replaceValues(
    valueToMatch: T | ((value: T, key: [number, number]) => boolean),
    newValue: T | ((oldValue: T, key: [number, number]) => T)
  ): number {
    let replacedCount = 0;

    // Process each entry in the dictionary
    for (const [key, value] of this.entries()) {
      let isMatch = false;

      // Check if the value matches the criteria
      if (typeof valueToMatch === "function") {
        // Use the matcher function
        isMatch = (valueToMatch as Function)(value, key);
      } else {
        // Direct equality comparison
        // For objects, this compares references, not deep equality
        isMatch = value === valueToMatch;
      }

      // If there's a match, replace the value
      if (isMatch) {
        // Determine the replacement value
        const replacement =
          typeof newValue === "function"
            ? (newValue as Function)(value, key)
            : newValue;

        // Update the dictionary
        this.set(key, replacement);
        replacedCount++;
      }
    }

    return replacedCount;
  }
}

/** Usage Examples for above */
// import { TupleKeyDictionary } from './TupleKeyDictionary';

{
  // Create a dictionary with string values
  const grid = new TupleKeyDictionary<string>();

  // Add some values using tuple keys
  grid.set([0, 0], "Top Left");
  grid.set([0, 1], "Top Right");
  grid.set([1, 0], "Bottom Left");
  grid.set([1, 1], "Bottom Right");

  // Get the internal items map (reference)
  const itemsRef = grid.getItems();
  console.log("Items map size:", itemsRef.size); // Output: 4

  // Modifying the reference affects the original
  itemsRef.set("2,2", "Extra Item");
  console.log("Grid size after modifying reference:", grid.size()); // Output: 5

  // Get a copy of the items (safe to modify)
  const itemsCopy = grid.getItemsCopy();
  itemsCopy.delete("0,0"); // This won't affect the original grid
  console.log("Original grid still has [0,0]:", grid.has([0, 0])); // Output: true

  // Create a copy with a new item
  const gridWithNewItem = grid.getCopyWithNewItem([3, 3], "New Corner");
  console.log("Original grid size:", grid.size()); // Output: 5
  console.log("New grid size:", gridWithNewItem.size()); // Output: 6
  console.log("New item in copy:", gridWithNewItem.get([3, 3])); // Output: "New Corner"
  console.log("New item in original:", grid.get([3, 3])); // Output: undefined

  // Clone the entire dictionary
  const clonedGrid = grid.clone();
  grid.clear(); // Clear the original
  console.log("Original grid size after clearing:", grid.size()); // Output: 0
  console.log("Cloned grid size:", clonedGrid.size()); // Output: 5
}

// ------------
// {
//   // Create and populate a dictionary
//   const gameMap = new TupleKeyDictionary<{ type: string; passable: boolean }>();
//   gameMap.set([0, 0], { type: "grass", passable: true });
//   gameMap.set([0, 1], { type: "water", passable: false });
//   gameMap.set([1, 0], { type: "mountain", passable: false });
//   gameMap.set([1, 1], { type: "forest", passable: true });

//   // Serialize to JSON string
//   const jsonData = gameMap.toJSON();
//   console.log("Serialized dictionary:");
//   console.log(jsonData);
//   /*
// Output will be something like:
// {
//   "entries": [
//     {"key":[0,0],"value":{"type":"grass","passable":true}},
//     {"key":[0,1],"value":{"type":"water","passable":false}},
//     {"key":[1,0],"value":{"type":"mountain","passable":false}},
//     {"key":[1,1],"value":{"type":"forest","passable":true}}
//   ]
// }
// */

//   // Save this JSON string (e.g., to localStorage, a file, or a database)
//   // ...

//   // Later, load the dictionary from the JSON string
//   const loadedMap = new TupleKeyDictionary<{
//     type: string;
//     passable: boolean;
//   }>();
//   loadedMap.fromJSON(jsonData);

//   // Verify the loaded data
//   console.log("Loaded map size:", loadedMap.size()); // Output: 4
//   console.log("Tile at [0, 1]:", loadedMap.get([0, 1])); // Output: { type: "water", passable: false }

//   // Alternatively, use the static method to create a new dictionary from JSON
//   const newMap = TupleKeyDictionary.fromJSON<{
//     type: string;
//     passable: boolean;
//   }>(jsonData);
//   console.log("New map created from JSON has size:", newMap.size()); // Output: 4

//   // Example of error handling
//   try {
//     const invalidJson = '{"not_entries": []}';
//     loadedMap.fromJSON(invalidJson);
//   } catch (error: any) {
//     console.error("Error loading invalid JSON:", error.message);
//     // Output: Error loading invalid JSON: Failed to parse JSON: Invalid JSON format: missing or invalid 'entries' array
//   }

//   // Demonstration of persistence between sessions
//   function saveMapToStorage(map: TupleKeyDictionary<any>, key: string): void {
//     // In a browser environment
//     if (typeof localStorage !== "undefined") {
//       localStorage.setItem(key, map.toJSON());
//       console.log(`Map saved to localStorage with key: ${key}`);
//     } else {
//       console.log(`Map serialized for storage: ${map.toJSON()}`);
//       // In Node.js you might use fs.writeFileSync() here
//     }
//   }

//   function loadMapFromStorage<T>(key: string): TupleKeyDictionary<T> | null {
//     // In a browser environment
//     if (typeof localStorage !== "undefined") {
//       const saved = localStorage.getItem(key);
//       if (saved) {
//         return TupleKeyDictionary.fromJSON<T>(saved);
//       }
//     }
//     return null;
//   }

//   // Usage example
//   saveMapToStorage(gameMap, "game-map");
//   // Later or in another session
//   const retrievedMap = loadMapFromStorage<{ type: string; passable: boolean }>(
//     "game-map"
//   );
// }

// ----------------

{
  // import { TupleKeyDictionary } from "./TupleKeyDictionary";

  // Example 1: Simple value replacement in a string dictionary
  const stringDict = new TupleKeyDictionary<string>();
  stringDict.set([0, 0], "apple");
  stringDict.set([0, 1], "banana");
  stringDict.set([1, 0], "apple");
  stringDict.set([1, 1], "orange");
  stringDict.set([2, 0], "grape");

  // Replace all "apple" values with "pear"
  const replacedCount1 = stringDict.replaceValues("apple", "pear");
  console.log(`Replaced ${replacedCount1} values`); // Output: Replaced 2 values
  console.log(stringDict.get([0, 0])); // Output: "pear"
  console.log(stringDict.get([1, 0])); // Output: "pear"

  // Example 2: Using a function to match values
  const numberDict = new TupleKeyDictionary<number>();
  numberDict.set([0, 0], 10);
  numberDict.set([0, 1], 15);
  numberDict.set([1, 0], 20);
  numberDict.set([1, 1], 25);
  numberDict.set([2, 0], 30);

  // Replace all values greater than 20 with 0
  const replacedCount2 = numberDict.replaceValues((value) => value > 20, 0);
  console.log(`Replaced ${replacedCount2} values`); // Output: Replaced 2 values
  console.log(numberDict.get([1, 1])); // Output: 0
  console.log(numberDict.get([2, 0])); // Output: 0

  // Example 3: Using a function to generate new values
  const scoreDict = new TupleKeyDictionary<{ score: number; status: string }>();
  scoreDict.set([0, 0], { score: 75, status: "pending" });
  scoreDict.set([0, 1], { score: 90, status: "pending" });
  scoreDict.set([1, 0], { score: 60, status: "complete" });
  scoreDict.set([1, 1], { score: 85, status: "pending" });

  // Update the status of all pending entries with high scores
  const replacedCount3 = scoreDict.replaceValues(
    (value) => value.status === "pending" && value.score >= 85,
    (oldValue) => ({ ...oldValue, status: "excellent" })
  );
  console.log(`Replaced ${replacedCount3} values`); // Output: Replaced 2 values

  // Check the results
  console.log(scoreDict.get([0, 0])); // Output: { score: 75, status: "pending" }
  console.log(scoreDict.get([0, 1])); // Output: { score: 90, status: "excellent" }
  console.log(scoreDict.get([1, 1])); // Output: { score: 85, status: "excellent" }

  // Example 4: Using the key in the replacement logic
  const gridDict = new TupleKeyDictionary<{
    value: number;
    position: string;
  }>();
  gridDict.set([0, 0], { value: 1, position: "" });
  gridDict.set([0, 1], { value: 2, position: "" });
  gridDict.set([1, 0], { value: 3, position: "" });
  gridDict.set([1, 1], { value: 4, position: "" });

  // Add position information based on the key
  gridDict.replaceValues(
    () => true, // Match all values
    (oldValue, key) => ({
      ...oldValue,
      position: `Row ${key[0]}, Column ${key[1]}`,
    })
  );

  // Check the results
  console.log(gridDict.get([0, 1]));
  // Output: { value: 2, position: "Row 0, Column 1" }
}
