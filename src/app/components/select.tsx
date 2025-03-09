type ColorSelectProps = {
  cellColor: string;
  setCellColor: Function;
  colorsEnum: {};
  label: string;
};
export default function ColorSelect({
  cellColor,
  setCellColor,
  colorsEnum,
  label,
}: ColorSelectProps) {
  return (
    <>
      <label htmlFor="color-select">{label}</label>
      <select
        value={cellColor} // ...force the select's value to match the state variable...
        onChange={(e) => setCellColor(e.target.value)} // ... and update the state variable on any change!
        name="colors"
        id="color-select"
        className="bg-transparent hover:bg-blue-50 font-semibold hover:text-black py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        <option value="">Please choose color option:</option>
        {Object.entries(colorsEnum).map((elem, idx, arr) => {
          return (
            <option
              key={idx + "_" + label.trim().replace(" ", "")}
              value={String(elem[1])}
            >
              {elem[0]}
            </option>
          );
        })}
        {/* <option value="#FF0000">Red</option>
        <option value="#4169E1">Blue</option>
        <option value="#00FF00">Green</option>
        <option value="#FFA500">Orange</option>
        <option value="#9F2B68">Purple</option>
        <option value="#11ffe3">Teal</option> */}
      </select>
    </>
  );
}
