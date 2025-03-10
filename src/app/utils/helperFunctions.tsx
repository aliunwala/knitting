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

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
const fallbackCopyTextToClipboard = function (text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};

export const copyTextToClipboard = function (text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

// https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
// Sample call: download(jsonData, 'json.txt', 'text/plain');
export function downloadText(
  content: string,
  fileName: string,
  contentType?: string
) {
  if (!contentType) {
    contentType = "text/plain";
  }
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function initalBoardState(
  rowLen: number,
  rowNum: number,
  color = "#FFFFFF"
) {
  const boardState: Array<{ color: string }>[] = []; //Array(rowNum).fill(Array(rowLen).fill("x"));
  for (let i = 0; i < rowNum; i++) {
    boardState.push(new Array(rowLen).fill({ color: color }));
  }
  return boardState;
}
