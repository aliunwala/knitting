export const modify2DArray = (
  array: Array<any>,
  rowIndex: any,
  colIndex: any,
  newValue: any
) => {
  // Create a deep copy of the array
  const newArray = array.map((row) => [...row]);
  // Modify the copied array
  newArray[rowIndex][colIndex] = newValue;
  return newArray;
};
