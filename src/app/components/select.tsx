type ColorSelectProps = {
  cellColor: string;
  setCellColor: Function;
  colorsEnum: object;
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
      </select>
    </>
  );
}
