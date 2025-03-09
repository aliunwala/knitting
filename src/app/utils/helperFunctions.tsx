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
let fallbackCopyTextToClipboard = function (text: string) {
  let textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    let successful = document.execCommand("copy");
    let msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};

export let copyTextToClipboard = function (text: string) {
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
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
